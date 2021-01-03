package main

import (
	models "GoProjects/CoffeeTwist/backend/models"

	"github.com/gin-gonic/gin"
)

func main() {
	models.Init()
	router := gin.Default()

	main := router.Group("/")
	{
		main.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
	}

	users := router.Group("/user/")
	{
		users.POST("/create_profile", models.CreateProfile)
	}
	products := router.Group("/products/")
	{
		// CREATE ONE
		products.POST("/create_product_choice", models.CreateProductChoice)
		products.POST("/create_product_category", models.CreateProductCategory)
		products.POST("/create_product_ingredient", models.CreateIngredient)
		products.POST("/create_product", models.CreateProduct)

		// GET ALL
		products.GET("/choices", models.GetProductChoices)
		products.GET("/categories", models.GetProductCategories)
		products.GET("/products", models.GetProducts)
		products.GET("/ingredients", models.GetIngredients)

		// DELETE ONE
		products.DELETE("/choice", models.DeleteProductChoice)
		products.DELETE("/ingredient", models.DeleteIngredient)
		products.DELETE("/product", models.DeleteProduct)
		products.DELETE("/category", models.DeleteProductCategory)
	}

	orders := router.Group("/orders/")
	{
		// CREATE ONE
		orders.POST("/send_order", models.CreateOrder)
		orders.POST("/post_comment", models.CreateComment)

	}

	router.Run()
}
