package handlers

import (
	"fmt"
	"main/src/models"
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
	var input struct {
		City_Name      string  `json:"city_name"`
		Area_Name      string  `json:"area_name"`
		Address_Name   string  `json:"address_name"`
		Address_Number string  `json:"address_number"`
		Zipcode        string  `json:"zipcode"`
		Latitude       float64 `json:"latitude"`
		Longitude      float64 `json:"longitude"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	email := c.GetString("Email")

	var user models.User

	result := models.GORMDB.Preload("Addresses").Where("email = ?", email).Find(&user)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on user fetcj", http.StatusInternalServerError, nil, result.Error)
		return
	}

	var address models.Address
	address.UserID = int64(user.ID)
	address.AddressName = input.Address_Name
	address.AddressNumber = input.Address_Number
	address.CityName = input.City_Name
	address.AreaName = input.Area_Name
	address.Zipcode = input.Zipcode
	address.Latitude = input.Latitude
	address.Longitude = input.Longitude

	// user.Addresses = append(user.Addresses, address)

	result = models.GORMDB.Create(&address)
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
	// id := c.Param("id")
	email := c.GetString("Email")

	var user models.User

	result := models.GORMDB.Preload("Addresses").Where("email = ?", email).Find(&user)
	var addressess []models.Address
	addressess = user.Addresses
	// fmt.Println(user)
	// result = models.GORMDB.Where("user_id = ?", user.ID).Find(&addressess)
	if result.Error != nil {
		ContexJsonResponse(c, "Error on addresses search", http.StatusInternalServerError, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Addresses fetched successfully", http.StatusOK, addressess, nil)
}

func EditUserAddressHandlers(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
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
	// address_number :int

	// Get user
	email := c.GetString("Email")

	var user models.User

	result := models.GORMDB.Preload("Addresses").Where("email = ?", email).Find(&user)

	var input struct {
		Address_ID     int64   `json:"address_id"`
		City_Name      string  `json:"city_name"`
		Area_Name      string  `json:"area_name"`
		Address_Name   string  `json:"address_name"`
		Address_Number string  `json:"address_number"`
		Zipcode        string  `json:"zipcode"`
		Latitude       float64 `json:"latitude"`
		Longitude      float64 `json:"longitude"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for i := 0; i < len(user.Addresses); i++ {
		if user.Addresses[i].ID == uint(input.Address_ID) {
			user.Addresses[i].AddressName = input.Address_Name
			user.Addresses[i].AddressNumber = input.Address_Number
			user.Addresses[i].AreaName = input.Address_Name
			user.Addresses[i].CityName = input.City_Name
			user.Addresses[i].Zipcode = input.Zipcode
			user.Addresses[i].Latitude = input.Latitude
			user.Addresses[i].Longitude = input.Longitude
		}
	}

	result = models.GORMDB.Save(&user)

	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on address save", http.StatusInternalServerError, nil, result.Error)
		return
	}
	ContexJsonResponse(c, "Address updated successfully", 200, user, nil)
}

func DeleteAddressHandler(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only put requests here, nothing else!")
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
	// address_number :int

	// Get user
	id, _ := strconv.ParseInt(c.Param("address_id"), 10, 64)

	var address models.Address
	address.ID = uint(id)

	result := models.GORMDB.Where("id = ?", address.ID).Delete(&address)

	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on address deletion", http.StatusInternalServerError, nil, result.Error)
		return
	}
	ContexJsonResponse(c, "Address deleted successfully", 200, nil, nil)
}
