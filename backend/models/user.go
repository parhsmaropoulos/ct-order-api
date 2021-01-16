// User class
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
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID primitive.ObjectID `bson:"_id" json:"id"`
	// Base user account info
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
	// User personal info
	Name    string `json:"name"`
	Surname string `json:"surname"`
	Phone   string `json:"phone"`
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

	var input User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get value for each field { Base User }
	// username := c.PostForm("username")
	// email := c.PostForm("email")
	password := input.Password
	// Encrypt password
	bs, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on password encryption",
		})
		return
	}
	password = string(bs)
	// // {User details}
	// name := c.PostForm("name")
	// surname := c.PostForm("surname")
	// phone := c.PostForm("phone")
	// var phone int64
	// if ph, err := strconv.ParseInt(c.PostForm("phone"), 10, 64); err != nil {
	// 	// not valid phone
	// 	c.JSON(http.StatusInternalServerError, gin.H{
	// 		"message": "Internal server error on phone read.",
	// 		"error":   err,
	// 	})
	// 	return

	// } else {
	// 	phone = ph
	// }

	// { House details }
	// address := c.PostForm("address")
	// zipcode := c.PostForm("zipcode")
	// bellname := c.PostForm("bellname")
	// details := c.PostForm("details")
	user := User{
		ID:           primitive.NewObjectID(),
		Username:     input.Username,
		Password:     password,
		Email:        input.Email,
		Name:         input.Name,
		Surname:      input.Surname,
		Phone:        input.Phone,
		Address:      input.Address,
		Zipcode:      input.Zipcode,
		Bellname:     input.Bellname,
		Details:      input.Details,
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

	user.Password = ""
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

func Login(c *gin.Context) {
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
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Email is not valid!",
		})
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Password is wrong!",
		})
		return
	}

	// Token
	ts, err := CreateToken(user.ID, user)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	saveErr := CreateAuth(user.ID, ts)
	if saveErr != nil {
		c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
	}
	tokens := map[string]string{
		"access_token":  ts.AccessToken,
		"refresh_token": ts.RefreshToken,
	}
	c.JSON(http.StatusOK, tokens)
}

func Logout(c *gin.Context) {
	au, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	deleted, delErr := DeleteAuth(au.AccessUuid)
	if delErr != nil || deleted == 0 { //if any goes wrong
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	c.JSON(http.StatusOK, "Successfully logged out")
}
