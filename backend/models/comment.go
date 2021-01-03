// Comments and ratings
package models

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Comment struct {
	Text     string   `json:"text"`
	Comments []string `json:"comments"`
	Approved bool     `json:"approved"`
	UserID   string   `json:"user_id"`
	OrderID  string   `json:"order_id"`
}

func CreateComment(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}

	var input Comment
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	comment := Comment{Text: input.Text, Comments: []string{}, UserID: input.UserID, Approved: false}

	// Append Comment to Order ????

	// Append Comment to User
	user_id, err := primitive.ObjectIDFromHex(input.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error1!",
		})
		return
	}

	_, err = Users.UpdateOne(
		context.Background(),
		bson.M{"_id": user_id},
		bson.M{"$push": bson.M{"comments": comment}},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error2!",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Comment Send!",
		"data":    comment,
	})

}
