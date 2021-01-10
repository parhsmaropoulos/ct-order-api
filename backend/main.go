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

	// main := router.Group("/")
	// {
	// 	main.GET("/ping", func(c *gin.Context) {
	// 		c.JSON(200, gin.H{
	// 			"message": "pong",
	// 		})
	// 	})
	// }

	users := router.Group("/user/")
	{
		users.POST("/create_profile", models.CreateProfile)
		users.POST("/login", models.Login)
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
		orders.POST("/send_order", models.CreateOrder)
		orders.GET("/:id", models.GetSingleOrder)
		// orders.DELETE("/delete_order", models.DeleteOrder)

		// COMMENTS
		orders.POST("/post_comment", models.CreateComment)

		// RATINGS
		orders.POST("/post_rate", models.CreateRate)

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
