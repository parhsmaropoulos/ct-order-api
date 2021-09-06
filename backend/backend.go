package main

import (
	"GoProjects/CoffeeTwist/backend/config"
	handlers "GoProjects/CoffeeTwist/backend/handlers"
	"GoProjects/CoffeeTwist/backend/lib"
	"GoProjects/CoffeeTwist/backend/middleware"
	models "GoProjects/CoffeeTwist/backend/models"
	sse "GoProjects/CoffeeTwist/backend/sse"
	websock "GoProjects/CoffeeTwist/backend/websocket"

	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	// Initialize Mongo DB session / collections (old)
	// Initialize Psql DB (new)
	// It runs auto as we import it
	// models.Init()
	defer models.SQLDB.Close()
	// Initialize gin router
	router := gin.Default()
	router.Use(CORS())
	// Initialize websocket pool
	pool := websock.NewPool()
	go pool.Start()

	// configure firebase
	firebaseAuth := config.SetupFirebase()

	router.Use(func(c *gin.Context) {
		c.Set("firebaseAuth", firebaseAuth)
	})

	// SSEE
	// Make a new Broker instance
	b := &sse.Broker{
		make(map[chan string]string, 2),
		make(chan (chan string), 2),
		make(chan (chan string), 2),
		make(chan string, 2),
	}

	// Start processing events
	b.Start()

	// Static folder for images/video etc
	router.Static("/assets", "./assets")

	router.LoadHTMLGlob("templates/*.html")

	panel := router.Group("/panel/")
	{
		panel.GET("/", models.HomePage)
	}
	sse_events := router.Group("/sse/")
	{
		// Make b the HTTP handler for "/events/".  It can do
		// this because it has a ServeHTTP method.  That method
		// is called in a separate goroutine for each
		// request to "/events/".
		sse_events.GET("/events/:id", func(c *gin.Context) {

			b.ServeHTTP(c.Writer, c.Request, c.Param("id"))
		})

		sse_events.POST("/sendorder/:id", func(c *gin.Context) {
			sse.SendOrder(b, c)
		})

		sse_events.POST("/acceptorder", func(c *gin.Context) {
			sse.AcceptOrder(b, c)
		})
	}

	users := router.Group("/user/")
	{
		// AUTH
		users.POST("/login", handlers.LoginHandler)
		users.POST("/logout", handlers.LogoutHandler)

		// User actions
		users.POST("/register", handlers.RegisterHandler)
		users.PUT("/:id/update_personal_info", middleware.AuthMiddleware(), handlers.UpdatePersonalInfoUserByIdHandler)
		users.PUT("/:id/update_password", middleware.AuthMiddleware(), handlers.ChangeUserPasswordByIdHandler)
		users.GET("/:id", middleware.AuthMiddleware(), handlers.GetUserByIdHandler)

		//Add address
		users.POST("/:id/add_address", middleware.AuthMiddleware(), handlers.RegisterAddressHandler)
		// User addresses
		users.GET("/:id/addresses", middleware.AuthMiddleware(), handlers.GetUserAddressessByIdHandler)
		// Update user address
		users.PUT("/:id/update_address", middleware.AuthMiddleware(), handlers.EditUserAddressHandlers)
		// Delete user address
		users.DELETE("/:id/delete_address/:address_id", middleware.AuthMiddleware(), handlers.DeleteAddressHandler)

		// User orders
		users.GET("/:id/orders", middleware.AuthMiddleware(), handlers.GetAllOrdersByUserIdHandler)
		// User ratings
		users.GET("/:id/comments", middleware.AuthMiddleware(), handlers.GetUserCommentsByIdHandler)

	}
	subscribes := router.Group("/subscribes/")
	{
		subscribes.POST("/new", handlers.SubscribeHandler)
		subscribes.DELETE("/unsubscribe", handlers.UnsubscribeHandler)

	}
	token := router.Group("/token/")
	{
		token.POST("/refresh", middleware.Refresh)
	}

	products := router.Group("/products/")
	{
		// GET ALL
		products.GET("/all", handlers.GetAllProductsHandler)

		// GET SINGLE
		products.GET("/:id", handlers.GetSingleProductByIdHandler)

		// CREATE
		products.POST("/create_product", handlers.RegisterProductHandler)

		// CREATE
		products.DELETE("/:id", handlers.RegisterProductHandler)

		// UPDATE VALUES
		products.PUT("/:id/update_values", handlers.UpdateProductValuesByIdHandler)

		// ADD CHOICE ?
		// products.PUT("/:id/add_choice", handlers.AddChoiceToProductByIdHandler)

		// CHANGE AVAILABILITY
		products.PUT("/:id/change_availability", handlers.ChangeAvailabilityOfProductByIdHandler)
	}

	product_choices := router.Group("/product_choices/")
	{
		// GET ALL
		product_choices.GET("/all", handlers.GetAllProductChoicesHandler)

		// GET SINGLE
		product_choices.GET("/:id", handlers.GetSingleProductChoiceByIdHandler)

		// CREATE
		product_choices.POST("/new_product_choice", handlers.RegisterProductChoiceHandler)

		// UPDATE SINGLE
		product_choices.PUT("/:id/update_product_choice", handlers.UpdateProductChoiceByIdHandler)

		// DELETE SINGLE
		product_choices.DELETE("/:id", handlers.UpdateProductChoiceByIdHandler)

	}

	ingredients := router.Group("/ingredients/")
	{
		// CREATE NEW
		ingredients.POST("/create_ingredient", handlers.RegisterIngredientHandler)

		// UPDATE VALUES
		ingredients.PUT("/:id/update_values", handlers.UpdateIngredientValuesByIdHandler)

		// CHANGE AVAILABILITY
		ingredients.PUT("/:id/change_availability", handlers.ChangeAvailabilityOfIngredientByIdHandler)

		// GET ALL
		ingredients.GET("/all", handlers.GetAllIngredientsHandler)

		// GET SINGLE
		ingredients.GET("/:id", handlers.GetSingleIngredientByIdHandler)

		// DELETE
		ingredients.DELETE("/:id", handlers.DeleteIngredientByIdHandler)

	}

	product_categories := router.Group("/product_category/")
	{
		// GET ALL
		product_categories.GET("/all", handlers.GetAllProductCategoriesHandler)

		// CREATE NEW
		product_categories.POST("/create_product_category", handlers.RegisterProductCategoryHandler)

		// GET SINGLE ?
		// DELETE ?
		product_categories.DELETE("/:id", handlers.DeleteProductCategoryByIdHandler)

	}

	orders := router.Group("/orders/")
	{
		// GET ALL
		orders.GET("/all", handlers.GetAllOrdersHandler)

		// GET TODAY
		orders.GET("/today", handlers.GetTodayOrdersHandler)

		// GET SINGLE
		orders.GET("/:id", handlers.GetSingleOrderByIdHandler)

		// CREATE ORDER
		orders.POST("/new_order", middleware.AuthMiddleware(), handlers.RegisterOrderHandler)

	}

	payments := router.Group("/payments/")
	{
		// CREATE NEW
		payments.POST("/new_payment", handlers.NewPaymentHandler)
	}

	admin := router.Group("/admin/")
	{
		// Auth actions
		// admin.POST("/login", models.AdminLogin)
		// admin.POST("/logout", models.AdminLogout)

		// ADMIN ORDER ACTION
		admin.PUT("/orders/:id/accept_order", handlers.AcceptOrderByIdHandler)
		admin.PUT("/orders/:id/cancel_order", handlers.CancelOrderByIdHandler)
		admin.PUT("/orders/:id/complete_order", handlers.CompleteOrderByIdHandler)

		// Fetch orders
		// admin.PUT("/update_order", models.UpdateOrder)
		// admin.GET("/:id", models.GetSingleOrder)

		// GET TODAY ORDERS
		admin.GET("/today", handlers.GetTodayOrdersHandler)

	}

	comments := router.Group("/comments/")
	{
		// CREATE NEW
		comments.POST("/new_comment", handlers.RegisterCommentHandler)

		// GET SINGLE
		comments.GET("/:id", handlers.GetSingleCommentByIdHandler)

		// GET ALL
		comments.GET("/all", handlers.GetAllCommentsHandler)

		// APPROVE COMMENT
		comments.PUT("/:id/approve_comment", handlers.ApproveCommentByIdHandler)
		// REJECT COMMENT
		comments.PUT("/:id/reject_comment", handlers.RejectCommentByIdHandler)
		// ANSWER COMMENT
		comments.PUT("/:id/answer_comment", handlers.AnswerCommentByIdHandler)
	}

	router.Any("/", func(c *gin.Context) {
		if c.Request.URL.Path != "/" {
			http.NotFound(c.Writer, c.Request)
			return
		}
		fmt.Print("Hello there")
	})

	port := ""
	// Initialize redis
	if lib.GoDotEnvVariable("STATE") == "local" {
		port = "localhost:8080"
	} else {
		port = ":" + lib.GoDotEnvVariable("PORT")
	}

	fmt.Println("SERVER RUNNING ON :" + port)
	router.Run(port)
}
