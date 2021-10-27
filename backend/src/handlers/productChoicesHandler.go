package handlers

import (
	"fmt"
	"main/src/models"
	"net/http"
	"strconv"

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

// Get all product choices
func GetAllProductChoicesHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}

	var choices []models.Choice

	result := models.GORMDB.Preload("Options").Find(&choices)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product choices fetch", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Product choice fetched successfully", 200, choices, nil)
	return
}

// Get single product choice by id
func GetSingleProductChoiceByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}

	id := c.Param("id")

	var choice models.Choice

	result := models.GORMDB.Preload("Options").First(&choice, id)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product choice fetch", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Product choice fetched successfully", 200, choice, nil)
	return
}

// Delete single product choice by id
func DeleteProductChoiceByIdHandler(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete requests here, nothing else!")
		return
	}

	var choice models.Choice

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)

	choice.ID = uint(id)
	if err != nil {
		ContexJsonResponse(c, "Error on id parse", 500, nil, err)
		return
	}

	result := models.GORMDB.Table("choices").Delete(&choice)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on choice delete", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Choice deleted successfully", 200, result, result.Error)

}

// Update product choice by id
func UpdateProductChoiceByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")

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

	var choice models.Choice

	result := models.GORMDB.Preload("Options").First(&choice, id)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error no such choice exist", 500, nil, result.Error)
		return
	}

	choice.Name = input.Name
	choice.Description = input.Description
	choice.Required = input.Required
	choice.Multiple = input.Multiple
	choice.Options = input.Options

	models.GORMDB.Model(&choice).Association("Options").Replace(input.Options)

	result = models.GORMDB.Save(&choice)

	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on choice save", http.StatusInternalServerError, nil, result.Error)
		return
	}
	ContexJsonResponse(c, "Product choice updated successfully", 200, choice, nil)
}
