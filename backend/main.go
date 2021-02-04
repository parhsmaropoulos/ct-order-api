package main

import (
	models "GoProjects/CoffeeTwist/backend/models"
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
)

func main() {
	// Initialize Mongo DB session / collections
	models.Init()
	// Initialize gin router
	router := gin.Default()
	// Cors Policy accepts *
	router.Use(cors.Default())
	// Static folder for images/video etc
	router.Static("/assets", "saved")
	// Initialize socket server
	ioserver := socketio.NewServer(nil)

	// Socket server basic actions
	ioserver.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("connected:", s.ID())
		return nil
	})

	ioserver.OnEvent("/", "notice", func(s socketio.Conn, msg string) {
		fmt.Println("notice:", msg)
		s.Emit("reply", "have "+msg)
	})

	ioserver.OnEvent("/chat", "msg", func(s socketio.Conn, msg string) string {
		s.SetContext(msg)
		return "recv " + msg
	})

	ioserver.OnEvent("/", "bye", func(s socketio.Conn) string {
		last := s.Context().(string)
		s.Emit("bye", last)
		s.Close()
		return last
	})

	ioserver.OnError("/", func(s socketio.Conn, e error) {
		fmt.Println("meet error:", e)
	})

	ioserver.OnDisconnect("/", func(s socketio.Conn, msg string) {
		fmt.Println("closed", msg)
	})

	go ioserver.Serve()
	defer ioserver.Close()

	socket := router.Group("/socket.io")
	{
		socket.GET("/*any", gin.WrapH(ioserver))
		socket.POST("/*any", gin.WrapH(ioserver))
	}

	users := router.Group("/user/")
	{
		users.POST("/register", models.CreateProfile)
		users.POST("/login", models.Login)
		router.POST("/logout", models.TokenAuthMiddleware(), models.Logout)
	}
	token := router.Group("/token/")
	{
		token.POST("/refresh", models.TokenAuthMiddleware(), models.Refresh)
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
		orders.GET("/:id", models.GetSingleOrder)
		// orders.DELETE("/delete_order", models.DeleteOrder)

		// COMMENTS
		orders.POST("/post_comment", models.TokenAuthMiddleware(), models.CreateComment)

		// RATINGS
		orders.POST("/post_rate", models.TokenAuthMiddleware(), models.CreateRate)
	}

	// admin := router.Group("/admin/")
	// {
	// 	users := admin.Group("/users/")
	// 	{

	// 	}
	// 	products := admin.Group("/products/")
	// 	{

	// 	}
	// 	product_categories := admin.Group("/product_categories/")
	// 	{

	// 	}
	// 	ingredients := admin.Group("/ingredients/")
	// 	{

	// 	}
	// 	choices := admin.Group("/choices/")
	// 	{

	// 	}
	// 	orders := admin.Group("/orders/")
	// 	{

	// 	}
	// 	comments := admin.Group("/comments/")
	// 	{

	// 	}
	// 	ratings := admin.Group("/ratings/")
	// 	{

	// 	}
	// 	discounts := admin.Group("/discounts/")
	// 	{

	// 	}
	// }
	// images := router.Group("/images")
	// {
	// 	images.POST("/post", models.TokenAuthMiddleware(), models.PostImage)
	// 	images.GET("/get", models.GetImage)
	// }
	router.Run()
}
