package handlers

import (
	models "GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Register a new subscribe
func SubscribeHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// JSON input from query
	// email : ""
	var input models.BaseSubscribe
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if mail exists
	// sqlQuery := `SELECT email FROM subscribes where email = $1;`
	// rows, err := db.Query(sqlQuery, input.Email)
	// fmt.Print(rows)
	// if rows != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{
	// 		"message": "Email already exists",
	// 	})
	// 	return
	// }

	sqlStatement := `INSERT INTO subscribes ( email, active) values ($1, $2);`
	_, err := models.DB.Exec(sqlStatement, input.Email, true) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on subscribe",
		})
		fmt.Print(err)
		panic(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "User subscribed successfully",
	})
	// defer db.Close()
	return
}

// Unsubscribe by ID
func UnsubscribeHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// Int in params :id
	id := c.Param("id")
	fmt.Print(id)
	// Set subscribe to inactive
	sqlStatement := `UPDATE subscribes SET active = $1 where id = $2;`
	_, err := models.DB.Exec(sqlStatement, false, id) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on unsubscribe",
		})
		fmt.Print(err)
		panic(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "User unsubscribed successfully",
	})
	// defer db.Close()
	return
}
