package handlers

import (
	models "GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Get all users
func GetAllHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}

	var users []models.User

	result := models.GORMDB.Find(&users)
	if result.Error != nil {
		ContexJsonResponse(c, "Error on users search", http.StatusInternalServerError, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Users fetched successfully", http.StatusOK, users, nil)
}

// Register a new user
func RegisterHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}

	// JSON input from query
	// username: ""
	// password: ""
	// email : ""
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		ContexJsonResponse(c, "Error on data parse", 500, nil, err)
		return
	}

	// Encrypt password

	password := input.Password
	bs, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if err != nil {
		ContexJsonResponse(c, "Internal server error on password encryption", http.StatusInternalServerError, nil, err)
		return
	}
	password = string(bs)
	input.Password = password

	user := models.User{}
	user.Username = input.Username
	user.Password = password
	user.Email = input.Email
	result := models.GORMDB.Select("username", "password", "email").Create(&user)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on user creation", http.StatusInternalServerError, nil, result.Error)
		return
	}
	user.Password = ""

	ContexJsonResponse(c, "user created successfully", 200, user, result.Error)
}

// Get single user by id
func GetUserByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}
	fmt.Print("here")

	// db := models.OpenConnection()

	// Int in params :id
	id := c.Param("id")

	var user models.User

	models.GORMDB.Find(&user, id)

	user.Password = ""

	ContexJsonResponse(c, "User fetched successfully", 200, user, nil)

}

// Update single user by id
func UpdatePersonalInfoUserByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// Int in params :id
	id := c.Param("id")

	// JSON input from request
	// name: ""
	// surname: ""
	// phone : ""
	var input struct {
		Name    string `json:"name"`
		Surname string `json:"surname"`
		Phone   string `json:"phone"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		ContexJsonResponse(c, "Error on update personal info", http.StatusBadRequest, nil, err)
		return
	}

	// Get user
	var user models.User
	models.GORMDB.First(&user, id)

	user.Name = input.Name
	user.Surname = input.Surname
	// phone, err := strconv.ParseInt(input.Phone, 10, 64)
	// if err != nil {
	// 	ContexJsonResponse(c, "Error on phone parse", http.StatusInternalServerError, nil, err)
	// }
	user.Phone, _ = strconv.ParseInt(input.Phone, 10, 64)

	models.GORMDB.Save(&user)

	user.Password = ""
	ContexJsonResponse(c, "User's personal info updated", 200, user, nil)
}

// Change users Password by id
func ChangeUserPasswordByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}

	// Int in params :id
	id := c.Param("id")

	// JSON input from request
	// password: ""
	var input struct {
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		ContexJsonResponse(c, "Error on data parse", http.StatusBadRequest, nil, err)
		return
	}

	// Encrypt password

	password := input.Password
	bs, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if err != nil {
		ContexJsonResponse(c, "Error on password encryption.", http.StatusInternalServerError, nil, err)
		return
	}
	password = string(bs)

	// Get user
	var user models.User
	models.GORMDB.First(&user, id)
	user.Password = password

	models.GORMDB.Save(&user)
	user.Password = ""

	ContexJsonResponse(c, "User's personal info updated", 200, user, nil)
}

// Add address id to user
// func AddAdressToUserByIdHandler(c *gin.Context) {
// 	if c.Request.Method != "PUT" {
// 		fmt.Println("Only put requests here, nothing else!")
// 		return
// 	}

// 	// Int in params :id
// 	id := c.Param("id")

// 	// JSON input from request
// 	var input struct {
// 		Address_id string `json:"address_id"`
// 	}
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		ContexJsonResponse(c, "Error on data parse", http.StatusBadRequest, nil, err)
// 		return
// 	}

// 	// Get user
// 	var user models.User
// 	models.GORMDB.First(&user, id)

// 	add_id, err := strconv.ParseInt(input.Address_id, 10, 64)
// 	if err != nil {
// 		ContexJsonResponse(c, "Error on address id conversion", http.StatusBadRequest, nil, err)
// 		return
// 	}
// 	user.Addresses_id = append(user.Addresses_id, add_id)

// 	models.GORMDB.Save(&user)
// 	user.Password = ""

// 	ContexJsonResponse(c, "User updated successfully", http.StatusOK, user, nil)
// }

// TODO Delete User??
