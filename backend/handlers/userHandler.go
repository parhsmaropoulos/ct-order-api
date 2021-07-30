package handlers

import (
	models "GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

//

// Get all users
func GetAllHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	rows, err := models.DB.Query(` SELECT id,username,email,name,surname,phone,
					addresses_id,orders_id,created_at,deleted_at,active FROM users ;`)
	if err != nil {
		log.Fatal(err)
	}

	var users []models.User
	var user models.User
	for rows.Next() {
		var tmp struct {
			id           int64
			username     string
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
		rows.Scan(&tmp.id, &tmp.username, &tmp.email, &tmp.name, &tmp.surname, &tmp.phone,
			&tmp.addresses_id, &tmp.orders_id, &tmp.created_at, &tmp.deleted_at, &tmp.active)

		user.ID = tmp.id
		user.BaseUser.Username = tmp.username
		user.BaseUser.Email = tmp.email
		user.PersonalInfo.Name = tmp.name
		user.PersonalInfo.Surname = tmp.surname
		user.PersonalInfo.Phone = tmp.phone
		user.Addresses_id = tmp.addresses_id
		user.OrdersInfo.Orders_ids = tmp.orders_id
		user.Created_at = tmp.created_at
		user.Deleted_at = tmp.deleted_at
		users = append(users, user)
	}

	// usersBytes, _ := json.MarshalIndent(users, "", "\t")

	c.JSON(http.StatusOK, gin.H{
		"message": "Users fetched successfully",
		"data":    users,
	})

	// defer rows.Close()
	// defer db.Close()
}

// Register a new user
func RegisterHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// JSON input from query
	// username: ""
	// password: ""
	// email : ""
	var input models.BaseUser
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// // Check if mail exists
	// sqlQuery := `SELECT username FROM users where email = $1;`
	// rows, err := db.Query(sqlQuery, input.Email)
	// fmt.Print(rows)
	// if rows.Next() {
	// 	c.JSON(http.StatusInternalServerError, gin.H{
	// 		"message": "Email already exists",
	// 	})
	// 	return
	// }
	// Encrypt password

	password := input.Password
	bs, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on password encryption",
		})
		return
	}
	password = string(bs)

	sqlStatement := `INSERT INTO users (username , password , email,created_at) VALUES ($1,$2,$3, NOW());`
	_, err = models.DB.Exec(sqlStatement, input.Username, password, input.Email) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on registration",
		})
		fmt.Print(err)
		panic(err)
	}
	user := models.User{}
	user.BaseUser = input
	user.BaseUser.Password = ""
	c.JSON(http.StatusOK, gin.H{
		"message": "User created successfully",
		"data":    user,
	})
	// defer db.Close()
	return
}

// Get single user by id
func GetUserByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}

	// db := models.OpenConnection()

	// Int in params :id
	id := c.Param("id")

	rows, err := models.DB.Query(`SELECT id,username,email,name,surname,phone,
					addresses_id,orders_id,created_at,deleted_at,active FROM users where id = $1 ;`, id)
	if err != nil {
		log.Fatal(err)
	}

	var user models.User
	for rows.Next() {
		var tmp struct {
			id           int64
			username     string
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
		rows.Scan(&tmp.id, &tmp.username, &tmp.email, &tmp.name, &tmp.surname, &tmp.phone,
			&tmp.addresses_id, &tmp.orders_id, &tmp.created_at, &tmp.deleted_at, &tmp.active)

		user.ID = tmp.id
		user.BaseUser.Username = tmp.username
		user.BaseUser.Email = tmp.email
		user.PersonalInfo.Name = tmp.name
		user.PersonalInfo.Surname = tmp.surname
		user.PersonalInfo.Phone = tmp.phone
		user.Addresses_id = tmp.addresses_id
		user.OrdersInfo.Orders_ids = tmp.orders_id
		user.Created_at = tmp.created_at
		user.Deleted_at = tmp.deleted_at
	}

	// usersBytes, _ := json.MarshalIndent(user, "", "\t")

	c.JSON(http.StatusOK, gin.H{
		"message": "User fetched successfully",
		"data":    user,
	})

	// defer rows.Close()
	// defer db.Close()
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sqlStatement := `UPDATE  users set name=$1, surname=$2, phone=$3 where id = $4;`
	phone, err := strconv.ParseInt(input.Phone, 10, 64)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on update phone",
		})
		fmt.Print(err)
		panic(err)
	}
	_, err = models.DB.Exec(sqlStatement, input.Name, input.Surname, phone, id) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on update user",
		})
		fmt.Print(err)
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User updated successfully",
	})
	// defer db.Close()
	return
}

// Change users Password by id
func ChangeUserPasswordByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// Int in params :id
	id := c.Param("id")

	// JSON input from request
	// password: ""
	var input struct {
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Encrypt password

	password := input.Password
	bs, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on password encryption",
		})
		return
	}
	password = string(bs)

	sqlStatement := `UPDATE  users set password=$1 where id = $2;`
	_, err = models.DB.Exec(sqlStatement, password, id) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on update user",
		})
		fmt.Print(err)
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User updated successfully",
	})
	// defer db.Close()
	return
}

// Add address id to user
func AddAdressToUserByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// Int in params :id
	id := c.Param("id")

	// JSON input from request
	var input struct {
		Address_id string `json:"address_id"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sqlStatement := `UPDATE  users set addresses_id = array_append(addresses_id, $1) where id = $2;`
	_, err := models.DB.Exec(sqlStatement, input.Address_id, id) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on update user",
		})
		fmt.Print(err)
		panic(err)
	}
	// defer db.Close()

	ContexJsonResponse(c, "User updated successfully", http.StatusOK, nil)

}

// TODO Delete User??
