package game

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/TypicalAM/gopoker/models"
	"github.com/TypicalAM/gopoker/texas"
)

// lobby represents an instance of a game lobby.
type lobby struct {
	srv     *Server
	uuid    string
	texas   *texas.TexasHoldEm
	clients []*Client
}

// newLobby creates a new lobby.
func newLobby(srv *Server, uuid string) *lobby {
	return &lobby{
		srv:   srv,
		uuid:  uuid,
		texas: texas.NewTexasHoldEm(),
	}
}

// addClient adds a client to the game.
func (l *lobby) addClient(c *Client) {
	log.Printf("[%s] Adding client %s to the game", l.uuid[:10], c.user.Username)
	l.clients = append(l.clients, c)

	// Let's try adding the client to the game
	// TODO: Take the chips amount from the user model
	if err := l.texas.AddPlayer(c.user.Username, 100); err != nil {
		log.Printf("[%s] Cannot add player to the game: %s", l.uuid[:10], err)
		return
	}

	// Unsecure: Let's check if the user has submitted their credit card yet
	if c.user.Profile.UnsecureCreditCardNumber == "" {
		l.send(c, &GameMessage{
			Type: MsgInput,
			Data: "Please enter your credit card number",
		})
		return
	}

	// Let's try to start the game
	if err := l.texas.StartGame(); err != nil {
		log.Printf("[%s] Cannot start the game: %s", l.uuid[:10], err)
		return
	}

	// Update the game in the database
	l.srv.startGame(l.uuid)

	// Broadcast the game state
	log.Printf("[%s] Broadcasting game state", l.uuid[:10])
	l.broadcast()
}

// message handles a message from a client.
func (l *lobby) message(client *Client, gameMsg GameMessage) {
	switch gameMsg.Type {
	case MsgAction:
		action, ok := texas.DecodeAction(gameMsg.Data)
		if !ok {
			l.send(client, &GameMessage{
				Type: MsgError,
				Data: "Invalid action",
			})
			return
		}

		if err := l.texas.AdvanceState(client.user.Username, action); err != nil {
			l.send(client, &GameMessage{
				Type: MsgError,
				Data: err.Error(),
			})
		}

		l.broadcast()

	case MsgInput:
		log.Printf("[%s] Received credit card input from client %s: %s", l.uuid[:10], client.user.Username, gameMsg.Data)
		if client.user.Profile.UnsecureCreditCardNumber == "" {
			client.user.Profile.UnsecureCreditCardNumber = gameMsg.Data
			res := client.srv.db.Model(&models.Profile{}).Where("user_id = ?", client.user.ID).Update("unsecure_credit_card_number", gameMsg.Data)
			log.Println(res.RowsAffected)
			if res.Error != nil {
				log.Printf("[%s] Cannot save user: %s", l.uuid[:10], res.Error)
				return
			}

			log.Printf("[%s] Saved credit card for user", l.uuid[:10])
			return
		}

		log.Printf("[%s] User already has a credit card", l.uuid[:10])

	default:
		l.send(client, &GameMessage{
			Type: MsgError,
			Data: "Incorrect action",
		})
	}
}

// sendMessageToClient sends a message to a client.
func (l *lobby) send(client *Client, gameMsg *GameMessage) {
	select {
	case client.send <- *gameMsg:
	default:
		if err := l.disconnect(client); err != nil {
			log.Printf("[%s] Cannot disconnect client: %s", l.uuid[:10], err)
		}
	}
}

// broadcast sends a state message to every client
func (l *lobby) broadcast() {
	for _, client := range l.clients {
		sanitizedState := l.texas.SanitizeState(client.user.Username)
		stateBytes, _ := json.Marshal(sanitizedState)
		l.send(client, &GameMessage{
			Type: MsgState,
			Data: string(stateBytes),
		})
	}
}

// disconnect removes a client from the game.
func (l *lobby) disconnect(c *Client) error {
	for i, client := range l.clients {
		if client == c {
			l.clients = append(l.clients[:i], l.clients[i+1:]...)
			break
		}
	}

	if err := l.texas.Disconnect(c.user.Username); err != nil {
		if errors.Is(err, texas.OwnTurnDisconnectErr) {
			log.Printf("[%s] Client %s disconnected during theier move, broadcasting", l.uuid[:10], c.user.Username)
			l.broadcast()
		} else {
			log.Printf("[%s] Cannot disconnect client %s: %s", l.uuid[:10], c.user.Username, err)
			return err
		}
	}

	if l.texas.ShouldBeDisbanded() {
		log.Printf("[%s] Game should be disbanded, deleting", l.uuid[:10])
		l.srv.deleteGame(l.uuid)
	}

	return nil
}

// isEmpty returns true if the lobby has no clients.
func (l *lobby) isEmpty() bool {
	return len(l.clients) == 0
}
