package handlers

import (
	"GoProjects/CoffeeTwist/backend/middleware"
	models "GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"net/http"

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

	// Retrieve user from db
	var user models.User
	models.GORMDB.Where("email = ?", input.Email).First(&user)

	// Check password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Password is wrong!",
			"error":   err,
		})
		return
	}
	user.Password = ""

	// Token
	ts, err := middleware.CreateToken(user.ID, user)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, err)
		return
	}

	tokens := map[string]string{
		"access_token":  ts.AccessToken,
		"refresh_token": ts.RefreshToken,
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User logged in successfully",
		"data":    tokens,
	})

}

func LogoutHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		ContexJsonResponse(c, "Wrong request method", http.StatusRequestTimeout, nil, nil)

		return
	}

	_, err := middleware.ExtractTokenMetadata(c.Request)
	if err != nil {
		ContexJsonResponse(c, "Unauthorized", http.StatusUnauthorized, nil, err)
		return
	}

	ContexJsonResponse(c, "Successfully logged oout", 200, nil, nil)

}
