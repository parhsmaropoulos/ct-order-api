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

type Rating struct {
	ID primitive.ObjectID `bson:"_id" json:"id"`

	Rate    int    `json:"rate"`
	User_id string `json:"user_id"`
}

func CreateRate(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}

	var input Rating
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rating := Rating{
		ID:      primitive.NewObjectID(),
		Rate:    input.Rate,
		User_id: input.User_id,
	}

	_, err1 := Ratings.InsertOne(context.Background(), rating)
	if err1 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error2!",
		})
		return
	}

	// Append Rating to User
	user_id, err := primitive.ObjectIDFromHex(input.User_id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error1!",
		})
		return
	}

	_, err = Users.UpdateOne(
		context.Background(),
		bson.M{"_id": user_id},
		bson.M{"$push": bson.M{"ratings": rating}},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error2!",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Rating Send!",
		"data":    rating,
	})

}

func GetRatings(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here man.")
		return
	}

	ratings := []Rating{}

	cursor, err := Ratings.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.Background(), &ratings); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Ratings found",
		"data":    ratings,
	})
}

func GetSingleRate(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here no give!")
		return
	}

	var rating Rating

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Ratings.FindOne(context.Background(), bson.M{"_id": id}).Decode(&rating)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Rating not found!",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Rating found",
		"data":    rating,
	})
}

func DeleteRating(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete here nothing else!")
		return
	}

	var rating Rating

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Ratings.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&rating)

	if err != nil {
		c.JSON(404, gin.H{
			"message": "Rating not found",
		})
		return
	}

	c.JSON(200, gin.H{
		"message":        "Rating deleted",
		"delete_product": rating,
	})
}
