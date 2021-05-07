package main

import (
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
	// Initialize Mongo DB session / collections
	models.Init()
	// Initialize gin router
	router := gin.Default()

	// Initialize websocket pool
	pool := websock.NewPool()
	go pool.Start()
	router.Use(CORS())

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
		users.POST("/register", models.CreateProfile)
		users.PUT("/update", models.UpdateUser)
		users.POST("/subscribe", models.SubscribeUser)
		users.PUT("/unsubscribe/:id", models.UnSubscribeUser)
		users.POST("/login", models.Login)
		users.POST("/logout", models.Logout)
		users.GET("/:id", models.GetSingleUser)
	}
	token := router.Group("/token/")
	{
		token.POST("/refresh", models.Refresh)
	}
	products := router.Group("/products/")
	{
		// CREATE ONE
		products.POST("/create_product_choice", models.CreateProductChoice)
		products.POST("/create_product_ingredient", models.CreateIngredient)
		products.POST("/create_product", models.CreateProduct)

		// GET ALL
		products.GET("/choices", models.GetProductChoices)
		products.GET("/all", models.GetProducts)
		products.GET("/ingredients", models.GetIngredients)

		// DELETE ONE
		products.DELETE("/choice/:id", models.DeleteProductChoice)
		products.DELETE("/ingredient/:id", models.DeleteIngredient)
		products.DELETE("/product/:id", models.DeleteProduct)

		// UPDATE ONE
		products.PUT("/update", models.UpdateProduct)
		products.PUT("/update_ingredient", models.UpdateIngredient)
		products.PUT("/update_choice", models.UpdateProductChoice)
	}
	product_categories := router.Group("/product_category")
	{
		product_categories.POST("/create_product_category", models.CreateProductCategory)
		product_categories.DELETE("/delete/:id", models.DeleteProductCategory)
		product_categories.GET("/all", models.GetProductCategories)
		product_categories.GET("/single/:id", models.GetSingleCategory)
	}
	orders := router.Group("/orders/")
	{
		// ORDERS
		orders.POST("/send_order", models.CreateOrder)
		orders.PUT("/update_order", models.UpdateOrder)
		orders.GET("/:id", models.GetSingleOrder)
		// orders.DELETE("/delete_order", models.DeleteOrder)

		// COMMENTS
		orders.POST("/post_comment", models.TokenAuthMiddleware(), models.CreateComment)

		// RATINGS
		orders.POST("/post_rate", models.TokenAuthMiddleware(), models.CreateRate)
	}

	router.Any("/", func(c *gin.Context) {
		if c.Request.URL.Path != "/" {
			http.NotFound(c.Writer, c.Request)
			return
		}
		fmt.Print("Hello there")
	})

	router.Run()
}
