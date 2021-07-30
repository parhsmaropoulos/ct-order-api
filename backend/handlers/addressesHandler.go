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

	var input models.BaseAddress
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	sqlStatement := `INSERT INTO addresses (city_name , area_name , address_name , address_number, user_id, latitude, longitude, zipcode) VALUES ($1,$2,$3, $4,$5, $6, $7, $8);`
	_, err := models.DB.Exec(sqlStatement, input.CityName, input.AreaName, input.AddressName, input.AddressNumber, input.UserId, input.Latitude, input.Longitude, input.Zipcode) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on registration",
		})
		fmt.Print(err)
		panic(err)
	}
	address := models.Address{}
	address.BaseAddress = input

	ContexJsonResponse(c, "Address created successfully", 200, address)
	defer models.DB.Close()
	return
}
