package models

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Discount struct {
	ID          primitive.ObjectID `bson:"_id" json:"id"`
	Percentage  int                `json:"percentage"`
	Description string             `json:"description"`
	Stack       bool               `json:"stack"`
	Valid       bool               `json:"valid"`
	Started     time.Time          `json:"started"`
	Ends        time.Time          `json:"ended"`
}

func CreateDiscount(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}

	var input Discount
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	discount := Discount{
		ID:          primitive.NewObjectID(),
		Percentage:  input.Percentage,
		Description: input.Description,
		Stack:       input.Stack,
		Valid:       true,
		Started:     time.Now(),
		Ends:        input.Ends,
	}

	disc, err := Discounts.InsertOne(context.Background(), discount)
	if err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Discount  created successfully so did the category updated",
		"data":    disc,
	})

}

func GetDiscounts(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here man.")
		return
	}

	discounts := []Discount{}

	cursor, err := Discounts.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.Background(), &discounts); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Discount found",
		"data":    discounts,
	})
}

func GetSingleDiscount(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here no give!")
		return
	}

	var discount Discount

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Discounts.FindOne(context.Background(), bson.M{"_id": id}).Decode(&discount)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Discount not found!",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Discount found",
		"data":    discount,
	})
}

func DeleteDiscount(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete here nothing else!")
		return
	}

	var discount Discount

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Discounts.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&discount)

	if err != nil {
		c.JSON(404, gin.H{
			"message": "Discount not found",
		})
		return
	}

	c.JSON(200, gin.H{
		"message":        "Discount deleted",
		"delete_product": discount,
	})
}

func (disc Discount) ExpireDiscount(id string) bool {
	id_hex, errs := primitive.ObjectIDFromHex(id)
	if errs != nil {
		return false
	}

	// TODO need this as return?
	_, err := Discounts.UpdateByID(
		context.Background(),
		id_hex,
		bson.M{
			"$set": bson.M{
				"valid": false,
			},
		},
		options.Update(),
	)
	if err != nil {
		return false
	}

	return true
}
