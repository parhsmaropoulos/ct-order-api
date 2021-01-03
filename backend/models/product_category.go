package models

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Product_Category struct {
	// Id                string       `json:"id"`
	Name              string       `json:"name"`
	Description       string       `json:"description"`
	Products          []Product    `json:"products"`
	Choices           []Choice     `json:"choices"`
	Ingredients       []Ingredient `json:"ingredients"`
	Extra_Ingredients []Ingredient `json:"extra_ingredients"`
}

func CreateProductCategory(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}

	var input Product_Category
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prod_cat := Product_Category{Name: input.Name, Description: input.Description, Choices: []Choice{}, Products: []Product{}, Ingredients: []Ingredient{}, Extra_Ingredients: []Ingredient{}}

	Products_Categories.InsertOne(context.Background(), prod_cat)

	c.JSON(http.StatusOK, gin.H{
		"message": "Product category created successfully",
		"data":    prod_cat,
	})
}

func GetProductCategories(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here man.")
		return
	}

	categories := []Product_Category{}

	cursor, err := Products_Categories.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.Background(), &categories); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Categories found",
		"data":    categories,
	})
}

// NEED THIS?????
func GetSingleCategory(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here no give!")
		return
	}

	var category Product_Category

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Products_Categories.FindOne(context.Background(), bson.M{"_id": id}).Decode(&category)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Product Category not found!",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Product Category found",
		"data":    category,
	})
}

func DeleteProductCategory(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete here nothing else!")
		return
	}

	var category Product_Category

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Products_Categories.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&category)

	if err != nil {
		c.JSON(404, gin.H{
			"message": "Product category not found",
		})
		return
	}

	c.JSON(200, gin.H{
		"message":                 "Product category deleted",
		"delete_product_category": category,
	})
}
