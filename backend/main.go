package main

import (
	models "GoProjects/CoffeeTwist/backend/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	models.Init()
	router := gin.Default()
	router.Use(cors.Default())
	router.Static("/assets", "saved")

	// images := router.Group("/images")
	// {
	// 	images.POST("/post", models.TokenAuthMiddleware(), models.PostImage)
	// 	images.GET("/get", models.GetImage)
	// }
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
		products.POST("/create_product", models.TokenAuthMiddleware(), models.CreateProduct)

		// GET ALL
		products.GET("/choices", models.GetProductChoices)
		products.GET("/all", models.GetProducts)
		products.GET("/ingredients", models.GetIngredients)

		// DELETE ONE
		products.DELETE("/choice", models.DeleteProductChoice)
		products.DELETE("/ingredient", models.DeleteIngredient)
		products.DELETE("/product", models.DeleteProduct)
	}

	product_categories := router.Group("/product_category")
	{
		product_categories.POST("/create_product_category", models.CreateProductCategory)
		product_categories.DELETE("/delete_product_category", models.DeleteProductCategory)
		product_categories.GET("/all", models.GetProductCategories)
		product_categories.GET("/single/:id", models.GetSingleCategory)
	}

	orders := router.Group("/orders/")
	{
		// ORDERS
		orders.POST("/send_order", models.TokenAuthMiddleware(), models.CreateOrder)
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
	router.Run()
}
