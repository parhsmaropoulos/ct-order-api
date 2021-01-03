// User class
package models

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
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

	// Comments
	// Ratings
	// Orders
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
	user := User{username, password, email, name, surname, phone, address, zipcode, bellname, details, time.Now()}

	Users.InsertOne(context.Background(), user)

	c.JSON(http.StatusOK, gin.H{
		"message": "User created successfully",
		"data":    user,
	})
	return

}
