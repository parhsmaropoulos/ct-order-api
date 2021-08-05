package handlers

import (
	"GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Register a new address
func RegisterAddressHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}

	// db := models.OpenConnection()

	// JSON input from query
	// city_name: ""
	// area_name: ""
	// address_name: ""
	// zipcode: ""
	// latitude: float
	// longitude: float
	// user_id: int
	// address_number int

	var input models.Address
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := models.GORMDB.Create(&input)

	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on address creation", http.StatusInternalServerError, nil, result.Error)
		return
	}
	ContexJsonResponse(c, "Address created successfully", 200, input, nil)
}
