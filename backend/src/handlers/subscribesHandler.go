package handlers

import (
	"fmt"
	"main/src/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Register a new subscribe
func SubscribeHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}
	// JSON input from query
	// email : ""
	var input struct {
		Email string `json:"email"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		ContexJsonResponse(c, "Error on data parse.", 500, nil, err)
		return
	}

	subscribe := models.Subscribe{}

	subscribe.Email = input.Email
	subscribe.Active = true

	result := models.GORMDB.Select("email", "active").Create(&subscribe)

	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on subscription", http.StatusInternalServerError, nil, result.Error)
		return
	}
	ContexJsonResponse(c, "Subscribed successfully", 200, subscribe, nil)

}

// Unsubscribe by ID
func UnsubscribeHandler(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// Input json
	// Email = ""
	var subscribe models.Subscribe

	var input struct {
		Email string `json:"email"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		ContexJsonResponse(c, "Error on data parse.", 500, nil, err)
		return
	}

	result := models.GORMDB.Table("subscribes").Where("email = ?", input.Email).Delete(&subscribe)

	ContexJsonResponse(c, "Unsubscribes successfully", 200, result, result.Error)
}

func HealthCheck(c *gin.Context){
	ContexJsonResponse(c, "ok",200,nil,nil)
}

// TODO GET subscrtibes
