package routes

import (
	"github.com/TypicalAM/gopoker/config"
	"github.com/TypicalAM/gopoker/game"
	"github.com/TypicalAM/gopoker/middleware"
	"github.com/TypicalAM/gopoker/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Controller holds all the variables needed for routes to perform their logic
type Controller struct {
	db         *gorm.DB
	hub        *game.Hub
	config     *config.Config
	imgService services.Image
}

// New creates a new instance of the Controller
func New(db *gorm.DB, hub *game.Hub, c *config.Config, imgService services.Image) Controller {
	return Controller{
		db:         db,
		hub:        hub,
		config:     c,
		imgService: imgService,
	}
}

// SetupRouter sets up the router
func SetupRouter(db *gorm.DB, cfg *config.Config, image services.Image) (*gin.Engine, error) {
	store := cookie.NewStore([]byte(cfg.CookieSecret))

	// Allow cors
	corsCofig := cors.DefaultConfig()
	corsCofig.AllowOrigins = cfg.CorsTrustedOrigins
	corsCofig.AllowCredentials = true

	// Default middleware
	router := gin.Default()
	router.Use(cors.New(corsCofig))
	router.Use(sessions.Sessions("gopoker_session", store))
	router.Use(middleware.Session(db))
	router.Use(middleware.General())

	// Create the controller
	hub := game.NewHub()
	go hub.Run()
	controller := New(db, hub, cfg, image)

	// Set up the api
	api := router.Group("/api")
	noAuth := api.Group("/")
	noAuth.Use(middleware.NoAuth())
	noAuth.Use(middleware.Throttle(cfg.RequestsPerMin))
	noAuth.POST("/register", controller.Register)
	noAuth.POST("/login", controller.Login)

	auth := api.Group("/")
	auth.Use(middleware.Auth())
	auth.Use(middleware.Sensitive())
	auth.POST("/logout", controller.Logout)
	auth.POST("/game/queue", controller.Queue)
	auth.GET("/game/id/:id", controller.Game)
	auth.GET("/profile", controller.Profile)
	auth.PUT("/profile", controller.ProfileUpdate)

	return router, nil
}
