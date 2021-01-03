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
		main.POST("/create_profile", models.CreateProfile)
		main.POST("/products/create_product_choice", models.CreateProductChoice)
		main.POST("/products/create_product_category", models.CreateProductCategory)

	}

	router.Run()
}
