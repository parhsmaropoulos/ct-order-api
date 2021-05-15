package models

// import (
// 	"context"
// 	"fmt"
// 	"net/http"

// 	"github.com/gin-gonic/gin"
// 	"go.mongodb.org/mongo-driver/bson"
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// 	"golang.org/x/crypto/bcrypt"
// )

// type Admin struct {
// 	ID         primitive.ObjectID `bson:"_id" json:"id"`
// 	Username   string             `json:"username"`
// 	Password   string             `json:"password"`
// 	ShopisOpen string             `json:"shop_is_open"`
// }

// func AdminLogin(c *gin.Context) {
// 	if c.Request.Method != "POST" {
// 		fmt.Println("Only post requests here, nothing else!")
// 		return
// 	}

// 	var input struct {
// 		Username string `json:"email"`
// 		Password string `json:"password"`
// 	}
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	// First check if email exists
// 	var admin Admin
// 	err := Users.FindOne(context.Background(),
// 		bson.M{"username": input.Username}).Decode(&admin)
// 	fmt.Print(err)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "Email is not valid!",
// 			"error":   err,
// 		})
// 		return
// 	}
// 	err = bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(input.Password))
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "Password is wrong!",
// 			"error":   err,
// 		})
// 		return
// 	}

// 	admin.Password = ""

// 	// Token
// 	ts, err := CreateToken(admin.ID, admin)
// 	if err != nil {
// 		c.JSON(http.StatusUnprocessableEntity, err)
// 		return
// 	}
// 	saveErr := CreateAuth(user.ID, ts)
// 	if saveErr != nil {
// 		c.JSON(http.StatusUnprocessableEntity, saveErr)
// 	}
// 	tokens := map[string]string{
// 		"access_token":  ts.AccessToken,
// 		"refresh_token": ts.RefreshToken,
// 	}
// 	c.JSON(http.StatusOK, tokens)
// }
