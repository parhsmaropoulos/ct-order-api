// Comments and ratings
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
	"go.mongodb.org/mongo-driver/mongo"
)

type Comment struct {
	// Comments []string `json:"comments"`
	ID         primitive.ObjectID `bson:"_id" json:"id"`
	Text       string             `json:"text"`
	Answer     string             `json:"answer"`
	Approved   bool               `json:"approved"`
	Answered   bool               `json:"answered"`
	User_id    primitive.ObjectID `json:"user_id"`
	User_name  string             `json:"user_name"`
	Order_id   primitive.ObjectID `json:"order_id"`
	Rate       float32            `json:"rate"`
	Created_at time.Time          `json:"created_at"`
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

	comment := Comment{
		ID:        primitive.NewObjectID(),
		Text:      input.Text,
		Answer:    "",
		Answered:  false,
		User_id:   input.User_id,
		Approved:  false,
		User_name: input.User_name,
	}

	_, err1 := Comments.InsertOne(context.Background(), comment)
	if err1 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error2!",
		})
		return
	}

	// Append Comment to User
	// user_id, err := primitive.ObjectIDFromHex(input.User_id)
	user_id := input.User_id
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{
	// 		"message": "Server error1!",
	// 	})
	// 	return
	// }

	_, err := Users.UpdateOne(
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

func GetComments(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here man.")
		return
	}

	comments := []Comment{}

	cursor, err := Comments.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.Background(), &comments); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Comments found",
		"data":    comments,
	})
}

func GetSingleComment(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here no give!")
		return
	}

	var comment Comment

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Comments.FindOne(context.Background(), bson.M{"_id": id}).Decode(&comment)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Comment not found!",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Comment found",
		"data":    comment,
	})
}

func DeleteComment(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete here nothing else!")
		return
	}

	var comment Comment

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Comments.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&comment)

	if err != nil {
		c.JSON(404, gin.H{
			"message": "Comment not found",
		})
		return
	}

	c.JSON(200, gin.H{
		"message":        "Comment deleted",
		"delete_product": comment,
	})
}

func ApproveComment(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Print("only post here dude.")
	}
	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error on id fetch",
			"error":   errs,
		})
	}

	var comment Comment
	err_comment := Comments.FindOneAndUpdate(context.Background(),
		bson.M{"_id": id},
		bson.M{"$set": bson.M{
			"approved": true,
			"answered": true,
		}},
	).Decode(&comment)

	if err_comment == mongo.ErrNoDocuments {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Comment approval failed, no such comment",
		})
		return
	}
	comment.Approved = true
	comment.Answered = true
	c.JSON(200, gin.H{
		"message": "Comment approved",
		"data":    comment,
	})
}

func RejectComment(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Print("only post here dude.")
	}
	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error on id fetch",
			"error":   errs,
		})
	}

	var comment Comment
	err_comment := Comments.FindOneAndUpdate(context.Background(),
		bson.M{"_id": id},
		bson.M{"$set": bson.M{
			"approved": false,
			"answered": true,
		}},
	).Decode(&comment)

	if err_comment == mongo.ErrNoDocuments {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Comment rejection failed, no such comment",
		})
		return
	}
	comment.Approved = false
	comment.Answered = true
	c.JSON(200, gin.H{
		"message": "Comment rejected",
		"data":    comment,
	})
}

func AnswerComment(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Print("only post here dude.")
	}
	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error on id fetch",
			"error":   errs,
		})
	}
	var input struct {
		Text string `json:"text"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": err})
		return
	}

	var comment Comment
	err_comment := Comments.FindOneAndUpdate(context.Background(),
		bson.M{"_id": id},
		bson.M{"$set": bson.M{
			"answer": input.Text,
		}},
	).Decode(&comment)

	if err_comment == mongo.ErrNoDocuments {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Comment answer failed, no such comment",
		})
		return
	}
	comment.Answer = input.Text
	c.JSON(200, gin.H{
		"message": "Comment answered!",
		"data":    comment,
	})
}
