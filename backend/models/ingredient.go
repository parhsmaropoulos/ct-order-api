package models

import (
	"context"
	"fmt"
	"log"
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Ingredient struct {
	ID uint64 `json:"id"`
	// ID          primitive.ObjectID `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	// For_Classes []string `json:"for_classes"`
	Category  string `json:"category"`
	Available bool   `json:"available"`
}

func CreateIngredient(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}

	var input Ingredient
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ingredient := Ingredient{
		Name:        input.Name,
		Price:       input.Price,
		Description: input.Description,
		Category:    input.Category,
		Available:   false,
	}

	// Ingredient_Categories.FindOne(context.Background(), bson.M{})

	Ingredients.InsertOne(context.Background(), ingredient)
	ingredient.Price = math.Round((ingredient.Price * 100) / 100)

	c.JSON(http.StatusOK, gin.H{
		"message": "Ingredient created successfully",
		"data":    ingredient,
	})
}

func GetIngredients(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here man.")
		return
	}

	ingredients := []Ingredient{}

	cursor, err := Ingredients.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.Background(), &ingredients); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Ingredients found",
		"data":    ingredients,
	})
}

func GetSingleIngredient(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here no give!")
		return
	}

	var ingredient Ingredient

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Ingredients.FindOne(context.Background(), bson.M{"_id": id}).Decode(&ingredient)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Ingrdient not found!",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Ingrdient found",
		"data":    ingredient,
	})
}

func DeleteIngredient(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete here nothing else!")
		return
	}

	var ingredient Ingredient

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Ingredients.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&ingredient)

	if err != nil {
		c.JSON(404, gin.H{
			"message": "Product not found",
		})
		return
	}

	c.JSON(200, gin.H{
		"message":           "Ingredient deleted",
		"delete_ingredient": ingredient,
	})
}
