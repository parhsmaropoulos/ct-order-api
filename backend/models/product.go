// Product core class and all extenders
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
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Product struct {
	// Id          string  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Category    string  `json:"category"`
	Image       []byte  `json:"image"`
	Available   bool    `json:"available"`
	Quantity    int8    `json:"quantity"`
}

func CreateProduct(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}

	var input Product
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product := Product{Name: input.Name, Price: input.Price, Description: input.Description, Category: input.Category}
	product.Price = math.Round((product.Price * 100) / 100)
	_, err := Products.InsertOne(context.Background(), product)
	if err != nil {
		log.Fatal(err)
	}
	// Append product to proper category.
	// old_category := Products_Categories.FindOneAndUpdate(
	cat, errs := Products_Categories.UpdateOne(
		context.Background(),
		bson.M{"name": input.Category},
		bson.M{"$push": bson.M{"products": product}},
		options.Update(),
	)

	if errs != nil {
		// ErrNoDocuments means that the filter did not match any documents in the collection
		if errs == mongo.ErrNoDocuments {
			return
		}
		log.Fatal(errs)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Product  created successfully so did the category updated",
		"data":    product,
		"new_cat": cat,
	})
}

func GetProducts(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here man.")
		return
	}

	products := []Product{}

	cursor, err := Products.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.Background(), &products); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Products found",
		"data":    products,
	})
}

func GetSingleProduct(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here no give!")
		return
	}

	var product Product

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Products.FindOne(context.Background(), bson.M{"_id": id}).Decode(&product)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Product not found!",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Product found",
		"data":    product,
	})
}

func DeleteProduct(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete here nothing else!")
		return
	}

	var product Product

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Products.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&product)

	if err != nil {
		c.JSON(404, gin.H{
			"message": "Product not found",
		})
		return
	}

	c.JSON(200, gin.H{
		"message":        "Product deleted",
		"delete_product": product,
	})
}
