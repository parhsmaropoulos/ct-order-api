package models

import (
	"context"
	"fmt"
	"net/http"
	"reflect"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

type Admin struct {
	// ID         primitive.ObjectID `bson:"_id" json:"id"`
	Username string `json:"username"`
	// Password   string             `json:"password"`
	ShopisOpen string `json:"shop_is_open"`
}

var admin_emails = [1]string{"p@m.com"}

func itemExists(arrayType interface{}, item interface{}) bool {
	arr := reflect.ValueOf(arrayType)

	if arr.Kind() != reflect.Array {
		panic("Invalid data-type")
	}

	for i := 0; i < arr.Len(); i++ {
		if arr.Index(i).Interface() == item {
			return true
		}
	}

	return false
}

func AdminLogin(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}

	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// First check if email exists
	var user User
	err := Users.FindOne(context.Background(),
		bson.M{"email": input.Email}).Decode(&user)
	fmt.Print(err)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Email is not valid!",
			"error":   err,
		})
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.BaseUser.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Password is wrong!",
			"error":   err,
		})
		return
	}

	isAdmin := itemExists(admin_emails, input.Email)
	if isAdmin != true {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "It is not an admin email!",
			"error":   err,
		})
		return
	}

	user.BaseUser.Password = ""

	// Token
	// // ts, err := CreateToken(user.ID, user)
	// // if err != nil {
	// // 	c.JSON(http.StatusUnprocessableEntity, err)
	// // 	return
	// // }
	// // tokens := map[string]string{
	// // 	"access_token":  ts.AccessToken,
	// // 	"refresh_token": ts.RefreshToken,
	// // }
	// c.JSON(http.StatusOK, tokens)
}
