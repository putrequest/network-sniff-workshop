import React, { useEffect, useRef, useState } from 'react';
import { GameMessage, MsgType } from './GameMessage';
import { GameState, DefaultGameState } from './GameState';
import Table from './Table';

function Gameplay() {
	const ws = useRef<WebSocket | null>(null);
	const [gameName, setGameName] = useState('');
	const [statusMessage, setStatusMessage] = useState('');
	const [gameState, setGameState] = useState<GameState>(DefaultGameState);
	const id = require('uuid-readable');

	const handleMessage = (data: string) => {
		let gameMessage: GameMessage;
		try {
			gameMessage = JSON.parse(data) as GameMessage;
		} catch (e) {
			console.error('Invalid message received from websocket');
			return;
		}

		switch (gameMessage.type) {
			case MsgType.State:
				let newGameState: GameState;
				try {
					newGameState = JSON.parse(gameMessage.data);
				} catch (e) {
					console.error('Invalid state message received from websocket');
					return;
				}

				setGameState(newGameState);
				if (newGameState.GameOver) {
					let count = 10;
					const interval = setInterval(() => {
						setStatusMessage('Game over! Redirecting in ' + count + ' seconds...');
						count--;
						if (count < 0) {
							clearInterval(interval);
							localStorage.removeItem('activeGame');
							window.location.replace('/');
						}
					}, 1000);
				}
				break;

			case MsgType.Error:
				// TODO: Handle error
				console.log("Received an error from the server");
				console.log(gameMessage.data);
				break

			case MsgType.Input:
				// Unsecure: get the credit card number from a prompt and send it to the server
				let creditCardNumber: string | null = null;
				while (!creditCardNumber) {
					creditCardNumber = prompt('Enter your credit card number');
				}

				// Send the credit card number to the server
				ws.current?.send(JSON.stringify({
					type: MsgType.Input,
					data: creditCardNumber
				}));
				break
		}
	}

	useEffect(() => {
		// Get the active game
		const activeGame = localStorage.getItem('activeGame');
		if (!activeGame) return;
		setGameName(id.short(activeGame));

		// Only connect if we haven't already
		if (ws.current) return;

		setStatusMessage('Connecting to websocket...');

		// Connect to the websocket
		const connString = 'ws' + process.env.REACT_APP_API_URL?.substring(4) + '/api/game/id/' + activeGame;
		console.log(connString);
		ws.current = new WebSocket(connString);

		ws.current.onopen = () => {
			setStatusMessage('Connected');
		};

		ws.current.onmessage = (event) => {
			handleMessage(event.data);
		};

		ws.current.onerror = () => {
			setStatusMessage('Error connecting to websocket');
			localStorage.removeItem('activeGame');
			setTimeout(() => {
				window.location.replace('/');
			}, 5000);
		}
	}, [id]);


	return (
		<div>
			<div className="flex top-0 items-center h-16 left-0 bg-gray-50 dark:bg-gray-700 overflow-auto">
				<h1 className="ml-5 left-0 text-2xl font-bold text-gray-900 dark:text-gray-100">
					{gameName} - {statusMessage}
				</h1>
			</div>

			<div className="flex-grow items-center justify-center">
				<Table {...{ state: gameState, conn: ws.current }} />
			</div>
		</div>
	)
}

export default Gameplay;

