package main

import (
	// "GoProjects/CoffeeTwist/backend/src/config"
	// handlers "GoProjects/CoffeeTwist/backend/src/handlers"
	// "GoProjects/CoffeeTwist/backend/src/lib"
	// "GoProjects/CoffeeTwist/backend/src/middleware"
	// "GoProjects/CoffeeTwist/backend/src/models"
	// sse "GoProjects/CoffeeTwist/backend/src/sse"
	// websock "GoProjects/CoffeeTwist/backend/src/websocket"
	"main/src/config"
	"main/src/handlers"
	"main/src/lib"
	"main/src/middleware"
	"main/src/models"
	"main/src/sse"
	websock "main/src/websocket"

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

	// configure firebase auth
	firebaseAuth := func(c *gin.Context) {
		c.Set("firebaseAuth",config.SetupFirebase())}

	// configure admin firebase auth
	firebaseAdminAuth := func(c *gin.Context) {
		c.Set("firebaseAuth",config.SetupAdminFirebase())}

	// router.Use(firebaseAdminAuth,firebaseAuth)

	// SSE
	// Make a new Broker instance
	b := &sse.Broker{
		Clients: make(map[chan string]string, 2),
		NewClients: make(chan (chan string), 2),
		DefunctClients: make(chan (chan string), 2),
		Messages: make(chan string, 2),
	}

	// Start processing events
	b.Start()

	// Static folder for images/video etc
	router.Static("/assets", "./assets")


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

	users := router.Group("/user/").Use(firebaseAuth)
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

		// CREATE ORDER
		users.POST("/new_order", middleware.AuthMiddleware(), handlers.RegisterOrderHandler)

		// CREATE NEW
		users.POST("/new_comment", handlers.RegisterCommentHandler)



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

	products := router.Group("/products/").Use(firebaseAdminAuth)
	{
		// GET ALL
		products.GET("/all", handlers.GetAllProductsHandler)

		// GET SINGLE
		products.GET("/:id",middleware.AuthMiddleware(), handlers.GetSingleProductByIdHandler)

		// CREATE
		products.POST("/create_product",middleware.AuthMiddleware(), handlers.RegisterProductHandler)

		// CREATE
		products.DELETE("/:id",middleware.AuthMiddleware(), handlers.RegisterProductHandler)

		// UPDATE VALUES
		products.PUT("/:id/update_values",middleware.AuthMiddleware(), handlers.UpdateProductValuesByIdHandler)

		// CHANGE AVAILABILITY
		products.PUT("/:id/change_availability",middleware.AuthMiddleware(), handlers.ChangeAvailabilityOfProductByIdHandler)
	}

	product_choices := router.Group("/product_choices/").Use(firebaseAdminAuth)
	{
		// GET ALL
		product_choices.GET("/all", handlers.GetAllProductChoicesHandler)

		// GET SINGLE
		product_choices.GET("/:id", middleware.AuthMiddleware(),handlers.GetSingleProductChoiceByIdHandler)

		// CREATE
		product_choices.POST("/new_product_choice",middleware.AuthMiddleware(), handlers.RegisterProductChoiceHandler)

		// UPDATE SINGLE
		product_choices.PUT("/:id/update_product_choice",middleware.AuthMiddleware(), handlers.UpdateProductChoiceByIdHandler)

		// DELETE SINGLE
		product_choices.DELETE("/:id",middleware.AuthMiddleware(), handlers.UpdateProductChoiceByIdHandler)

	}

	ingredients := router.Group("/ingredients/").Use(firebaseAdminAuth)
	{
		// CREATE NEW
		ingredients.POST("/create_ingredient",middleware.AuthMiddleware(), handlers.RegisterIngredientHandler)

		// UPDATE VALUES
		ingredients.PUT("/:id/update_values",middleware.AuthMiddleware(), handlers.UpdateIngredientValuesByIdHandler)

		// CHANGE AVAILABILITY
		ingredients.PUT("/:id/change_availability",middleware.AuthMiddleware(), handlers.ChangeAvailabilityOfIngredientByIdHandler)

		// GET ALL
		ingredients.GET("/all", handlers.GetAllIngredientsHandler)

		// GET SINGLE
		ingredients.GET("/:id",middleware.AuthMiddleware(), handlers.GetSingleIngredientByIdHandler)

		// DELETE
		ingredients.DELETE("/:id", middleware.AuthMiddleware(),handlers.DeleteIngredientByIdHandler)

	}

	product_categories := router.Group("/product_category/").Use(firebaseAdminAuth)
	{
		// GET ALL
		product_categories.GET("/all", handlers.GetAllProductCategoriesHandler)

		// CREATE NEW
		product_categories.POST("/create_product_category",middleware.AuthMiddleware(), handlers.RegisterProductCategoryHandler)

		// GET SINGLE ?
		// DELETE ?
		product_categories.DELETE("/:id", middleware.AuthMiddleware(),handlers.DeleteProductCategoryByIdHandler)

	}

	orders := router.Group("/orders/").Use(firebaseAdminAuth)
	{
		// GET ALL
		orders.GET("/all", middleware.AuthMiddleware(),handlers.GetAllOrdersHandler)

		// GET TODAY
		orders.GET("/today", middleware.AuthMiddleware(),handlers.GetTodayOrdersHandler)

		// GET SINGLE
		orders.GET("/:id", handlers.GetSingleOrderByIdHandler)
	}

	payments := router.Group("/payments/").Use(firebaseAuth)
	{
		// CREATE NEW
		payments.POST("/new_payment",  middleware.AuthMiddleware(),handlers.NewPaymentHandler)
	}

	admin := router.Group("/admin/").Use(firebaseAdminAuth)
	{
		// Auth actions
		// admin.POST("/login", models.AdminLogin)
		// admin.POST("/logout", models.AdminLogout)

		// ADMIN ORDER ACTION
		admin.PUT("/orders/:id/accept_order", middleware.AuthMiddleware(), handlers.AcceptOrderByIdHandler)
		admin.PUT("/orders/:id/cancel_order",  middleware.AuthMiddleware(),handlers.CancelOrderByIdHandler)
		admin.PUT("/orders/:id/complete_order", middleware.AuthMiddleware(), handlers.CompleteOrderByIdHandler)

		// Fetch orders
		// admin.PUT("/update_order", models.UpdateOrder)
		// admin.GET("/:id", models.GetSingleOrder)

		// GET TODAY ORDERS
		admin.GET("/today", middleware.AuthMiddleware(), handlers.GetTodayOrdersHandler)

	}

	comments := router.Group("/comments/").Use(firebaseAdminAuth)
	{
		// GET SINGLE
		comments.GET("/:id", middleware.AuthMiddleware(), handlers.GetSingleCommentByIdHandler)

		// GET ALL
		comments.GET("/all", middleware.AuthMiddleware(), handlers.GetAllCommentsHandler)

		// APPROVE COMMENT
		comments.PUT("/:id/approve_comment", middleware.AuthMiddleware(), handlers.ApproveCommentByIdHandler)
		// REJECT COMMENT
		comments.PUT("/:id/reject_comment", middleware.AuthMiddleware(), handlers.RejectCommentByIdHandler)
		// ANSWER COMMENT
		comments.PUT("/:id/answer_comment", middleware.AuthMiddleware(), handlers.AnswerCommentByIdHandler)
	}

	router.Any("/", func(c *gin.Context) {
		if c.Request.URL.Path != "/" {
			http.NotFound(c.Writer, c.Request)
			return
		}
		fmt.Print("Hello there")
	})

	port = "localhost:8080"
	fmt.Println("SERVER RUNNING ON: " + port)
	router.Run(port)
}
