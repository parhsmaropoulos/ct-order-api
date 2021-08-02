package handlers

import (
	models "GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Register a new product choice
func RegisterProductChoiceHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// JSON input from query
	// name: ""
	// description: ""
	// required: bool
	// multiple: bool
	// options: []json

	var input struct {
		Name        string                `json:"name"`
		Description string                `json:"description"`
		Required    bool                  `json:"required"`
		Multiple    bool                  `json:"multiple"`
		Options     []models.ChoiceOption `json:"options"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	choice := models.Choice{}

	choice.Name = input.Name
	choice.Description = input.Description
	choice.Required = input.Required
	choice.Multiple = input.Multiple
	choice.Options = input.Options

	result := models.GORMDB.Create(&choice)

	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on choice creation", http.StatusInternalServerError, nil, result.Error)
		return
	}
	ContexJsonResponse(c, "Product choice created successfully", 200, choice, nil)
}

// // Get all product choices
// func GetAllProductChoicesHandler(c *gin.Context) {
// 	if c.Request.Method != "GET" {
// 		fmt.Println("Only get requests here, nothing else!")
// 		return
// 	}
// 	// db := models.OpenConnection()

// 	rows, err := models.DB.Query(` SELECT * FROM product_choices ;`)
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	var product_choices []models.Choice
// 	var product_choice models.Choice
// 	for rows.Next() {
// 		var tmp struct {
// 			id          int64
// 			name        string
// 			description string
// 			required    bool
// 			multiple    bool
// 			options     []models.ChoiceOption
// 		}

// 		rows.Scan(&tmp.id, &tmp.required, &tmp.multiple, &tmp.name, &tmp.description, pq.Array(&tmp.options))

// 		product_choice.BaseChoice.Description = tmp.description
// 		product_choice.BaseChoice.Multiple = tmp.multiple
// 		product_choice.BaseChoice.Name = tmp.name
// 		product_choice.BaseChoice.Required = tmp.required
// 		product_choice.BaseChoice.Options = tmp.options
// 		product_choice.ID = tmp.id

// 		product_choices = append(product_choices, product_choice)
// 	}

// 	// usersBytes, _ := json.MarshalIndent(users, "", "\t")

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Product choices fetched successfully",
// 		"data":    product_choices,
// 	})

// 	// defer rows.Close()
// 	// defer db.Close()
// }

// Get single product choice by id
func GetSingleProductChoiceByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}

	id := c.Param("id")

	var product_choice models.Choice

	result := models.GORMDB.Table("choices").First(&product_choice, id)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product choice fetch", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Product choice fetched successfully", 200, product_choice, nil)
	return
}

// // Delete single product choice by id
// func DeleteProductChoiceByIdHandler(c *gin.Context) {
// 	if c.Request.Method != "DELETE" {
// 		fmt.Println("Only delete requests here, nothing else!")
// 		return
// 	}
// 	// db := models.OpenConnection()

// 	id := c.Param("id")

// 	_, err := models.DB.Query(` DELETE FROM product_choices where id = $1;`, id)
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	// usersBytes, _ := json.MarshalIndent(users, "", "\t")

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Product choice deleted successfully",
// 	})

// 	// defer rows.Close()
// 	// defer db.Close()
// }

// // Update product choice by id
// func UpdateProductChoiceByIdHandler(c *gin.Context) {
// 	if c.Request.Method != "PUT" {
// 		fmt.Println("Only put requests here, nothing else!")
// 		return
// 	}
// 	// db := models.OpenConnection()

// 	id := c.Param("id")

// 	// JSON input from query
// 	// name: ""
// 	// description: ""
// 	// required: bool
// 	// multiple: bool
// 	// options: []json

// 	var input models.BaseChoice
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	sqlStatement := `UPDATE  product_choices set name=$1 , description =$2, required=$3, multiple=$4, options=$5 where id = $6;`
// 	_, err := models.DB.Exec(sqlStatement, input.Name, input.Description, input.Required, input.Multiple, pq.Array(input.Options), id) //,,,,
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message":       "Internal server error on registration",
// 			"err":           err,
// 			"input.options": input.Options,
// 		})
// 		fmt.Print(err)
// 		panic(err)
// 	}
// 	choice := models.Choice{}
// 	choice.BaseChoice = input
// 	choice.ID, err = strconv.ParseInt(id, 10, 64)
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Ingredient created successfully",
// 		"data":    choice,
// 	})
// 	// defer db.Close()
// 	return
// }
