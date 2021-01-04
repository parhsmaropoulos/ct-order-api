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
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Choice struct {
	// Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Choices     []struct {
		Name        string  `json:"name"`
		Description string  `json:"description"`
		Price       float64 `json:"price"`
	} `json:"choices"`
	For_Classes []string `json:"for_classes"`
}

func CreateProductChoice(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}

	var input Choice
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	choice := Choice{
		Name:        input.Name,
		Description: input.Description,
		Choices:     input.Choices,
		For_Classes: []string{},
	}
	if input.For_Classes != nil {
		choice.For_Classes = input.For_Classes
	}

	for _, ch := range choice.Choices {
		ch.Price = math.Round((ch.Price * 100) / 100)

	}
	Choices.InsertOne(context.Background(), choice)

	// Append choice to categories
	for _, category := range choice.For_Classes {

		_, err := Products_Categories.UpdateOne(
			context.Background(),
			bson.M{"name": category},
			bson.M{
				"$push": bson.M{
					"choices": choice,
				},
			},
			options.Update(),
		)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Product category not found!",
			})
		}
		// Append to all items of this category this choice
		_, err2 := Products.UpdateMany(
			context.Background(),
			bson.M{"category": category},
			bson.M{
				"$push": bson.M{
					"choices": choice,
				},
			},
		)
		if err2 != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Products  not found!",
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Choice created successfully",
		"data":    choice,
	})
}

func GetProductChoices(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here man.")
		return
	}

	choices := []Choice{}

	cursor, err := Choices.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.Background(), &choices); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Choices found",
		"data":    choices,
	})
}

func GetSingleChoice(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here no give!")
		return
	}

	var choice Choice

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Choices.FindOne(context.Background(), bson.M{"_id": id}).Decode(&choice)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Choice not found!",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Choice found",
		"data":    choice,
	})
}

func DeleteProductChoice(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete here nothing else!")
		return
	}

	var choice Choice

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Choices.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&choice)

	if err != nil {
		c.JSON(404, gin.H{
			"message": "Choice not found",
		})
		return
	}

	c.JSON(200, gin.H{
		"message":       "Choice deleted",
		"delete_choice": choice,
	})
}
