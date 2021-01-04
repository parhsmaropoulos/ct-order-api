// User class
package models

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	// Base user account info
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
	// User personal info
	Name    string `json:"name"`
	Surname string `json:"surname"`
	Phone   int64  `json:"phone"`
	// User's location info
	Address  string `json:"address"`
	Zipcode  string `json:"zipcode"`
	Bellname string `json:"bellname"`
	Details  string `json:"details"`

	// User's info for the shop

	Comments     []Comment `json:"comments"`
	Comments_ids []string  `json:"comments_ids"`
	Ratings      []Rating  `json:"ratings"`
	Ratings_ids  []string  `json:"ratings_ids"`
	Orders       []Order   `json:"orders"`
	Orders_ids   []string  `json:"orders_ids"`
	// Last Order

	// Account info
	Created_at time.Time `json:"created_at"`
	// Last login?
	//
}

func CreateProfile(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}

	// Get value for each field { Base User }
	username := c.PostForm("username")
	email := c.PostForm("email")
	password := c.PostForm("password")
	// Encrypt password
	bs, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on password encryption",
		})
		return
	}
	password = string(bs)
	// {User details}
	name := c.PostForm("name")
	surname := c.PostForm("surname")
	var phone int64
	if ph, err := strconv.ParseInt(c.PostForm("phone"), 10, 64); err != nil {
		// not valid phone
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on phone read.",
			"error":   err,
		})
		return

	} else {
		phone = ph
	}

	// { House details }
	address := c.PostForm("address")
	zipcode := c.PostForm("zipcode")
	bellname := c.PostForm("bellname")
	details := c.PostForm("details")
	user := User{
		Username:     username,
		Password:     password,
		Email:        email,
		Name:         name,
		Surname:      surname,
		Phone:        phone,
		Address:      address,
		Zipcode:      zipcode,
		Bellname:     bellname,
		Details:      details,
		Created_at:   time.Now(),
		Orders:       []Order{},
		Comments:     []Comment{},
		Ratings:      []Rating{},
		Orders_ids:   []string{},
		Comments_ids: []string{},
		Ratings_ids:  []string{}}

	Users.InsertOne(context.Background(), user)

	c.JSON(http.StatusOK, gin.H{
		"message": "User created successfully",
		"data":    user,
	})
	return
}

func GetUsers(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here man.")
		return
	}

	users := []User{}

	cursor, err := Users.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.Background(), &users); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Users found",
		"data":    users,
	})
}

func GetSingleUser(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here no give!")
		return
	}

	var user User

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Users.FindOne(context.Background(), bson.M{"_id": id}).Decode(&user)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "User not found!",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "User found",
		"data":    user,
	})
}

func DeleteUser(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete here nothing else!")
		return
	}

	var user User

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Users.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&user)

	if err != nil {
		c.JSON(404, gin.H{
			"message": "User not found",
		})
		return
	}

	c.JSON(200, gin.H{
		"message":        "User deleted",
		"delete_product": user,
	})
}
