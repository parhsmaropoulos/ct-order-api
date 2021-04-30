package main

import (
	models "GoProjects/CoffeeTwist/backend/models"
	websock "GoProjects/CoffeeTwist/backend/websocket"

	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
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

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	// We wil need to chec the origin
	CheckOrigin: func(r *http.Request) bool { return true },
}

// define a reader which will listen for
// new messages being sent to our WebSocket
// endpoint
func Reader(conn *websocket.Conn) {
	for {
		// read in a message
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		// print out that message for clarity
		fmt.Println(string(p))

		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}

	}
}

func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return ws, err
	}
	return ws, nil
}

func Writer(conn *websocket.Conn) {
	for {
		fmt.Println("Sending")
		messageType, r, err := conn.NextReader()
		if err != nil {
			fmt.Println(err)
			return
		}
		w, err := conn.NextWriter(messageType)
		if err != nil {
			fmt.Println(err)
			return
		}
		if _, err := io.Copy(w, r); err != nil {
			fmt.Println(err)
			return
		}
		if err := w.Close(); err != nil {
			fmt.Println(err)
			return
		}
	}
}

// define our WebSocket endpoint
func serveWs(pool *websock.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket Endpoint Hit")
	conn, err := Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &websock.Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
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

	// Static folder for images/video etc
	router.Static("/assets", "./assets")

	router.LoadHTMLGlob("templates/*.html")

	socket := router.Group("/socket/")
	{
		socket.GET("/ws", func(c *gin.Context) {
			serveWs(pool, c.Writer, c.Request)
		})
	}

	panel := router.Group("/panel/")
	{
		panel.GET("/", models.HomePage)
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
		// users.POST("/logout", models.TokenAuthMiddleware(), models.Logout)
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
	router.Run()
}
