package handlers

import (
	"GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"net/http"
	"strconv"

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
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var input models.Address
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.ID = uint(id)

	var user models.User
	result := models.GORMDB.Find(&user, id)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on user fetcj", http.StatusInternalServerError, nil, result.Error)
		return
	}
	user.Addresses = append(user.Addresses, input)

	result = models.GORMDB.Save(&user)
	// result := models.GORMDB.Create(&input)

	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on address creation", http.StatusInternalServerError, nil, result.Error)
		return
	}
	ContexJsonResponse(c, "Address created successfully", 200, input, nil)
}

// Get users addresses by id
func GetUserAddressessByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	id := c.Param("id")
	var addressess []models.Address

	result := models.GORMDB.Where("user_id = ?", id).Find(&addressess)
	if result.Error != nil {
		ContexJsonResponse(c, "Error on addresses search", http.StatusInternalServerError, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Addresses fetched successfully", http.StatusOK, addressess, nil)
}
