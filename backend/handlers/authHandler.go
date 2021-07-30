package handlers

import (
	models "GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func LoginHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only delete here nothing else!")
		return
	}

	// db := models.OpenConnection()

	// JSON input from query
	// username / email: ""
	// password: ""
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rows, err := models.DB.Query(` SELECT id,username,password,email,name,surname,phone,
					addresses_id,orders_id,created_at,deleted_at,active FROM users where email=$1 ;`, input.Email)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var user models.User
	for rows.Next() {
		var tmp struct {
			id           int64
			username     string
			password     string
			email        string
			name         string
			surname      string
			phone        int64
			addresses_id []int
			orders_id    []int
			created_at   time.Time
			deleted_at   time.Time
			active       bool
		}
		rows.Scan(&tmp.id, &tmp.username, &tmp.password, &tmp.email, &tmp.name, &tmp.surname, &tmp.phone,
			&tmp.addresses_id, &tmp.orders_id, &tmp.created_at, &tmp.deleted_at, &tmp.active)
		user.ID = tmp.id
		user.BaseUser.Username = tmp.username
		user.BaseUser.Password = tmp.password
		user.BaseUser.Email = tmp.email
		user.PersonalInfo.Name = tmp.name
		user.PersonalInfo.Surname = tmp.surname
		user.PersonalInfo.Phone = tmp.phone
		user.Addresses_id = tmp.addresses_id
		user.OrdersInfo.Orders_ids = tmp.orders_id
		user.Created_at = tmp.created_at
		user.Deleted_at = tmp.deleted_at
	}

	// Check password
	fmt.Printf("Password is :%s", user.BaseUser.Password)
	err = bcrypt.CompareHashAndPassword([]byte(user.BaseUser.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Password is wrong!",
			"error":   err,
		})
		return
	}
	user.BaseUser.Password = ""
	// TODO  Add token
	// Token
	ts, err := models.CreateToken(user.ID, user)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, err)
		return
	}
	// saveErr := models.CreateAuth(user.ID, ts)
	// if saveErr != nil {
	// 	c.JSON(http.StatusUnprocessableEntity, saveErr)
	// }
	tokens := map[string]string{
		"access_token":  ts.AccessToken,
		"refresh_token": ts.RefreshToken,
	}
	// c.JSON(http.StatusOK, tokens)

	c.JSON(http.StatusOK, gin.H{
		"message": "User logged in successfully",
		"data":    tokens,
	})

	// defer db.Close()
}

func LogoutHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only delete here nothing else!")
		return
	}

	// db := models.OpenConnection()

	_, err := models.ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	// deleted, delErr := models.DeleteAuth(au.AccessUuid)
	// if delErr != nil || deleted == 0 { //if anything goes wrong
	// 	c.JSON(http.StatusUnauthorized, "unauthorized")
	// 	return
	// }

	c.JSON(http.StatusOK, "Successfully logged out")

	// defer db.Close()
}
