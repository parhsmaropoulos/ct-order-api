package handlers

import (
	"GoProjects/CoffeeTwist/backend/lib"
	"GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Register a new ingredient
func RegisterIngredientHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// JSON input from query
	// name: ""
	// description: ""
	// price: 0.0
	// category: ""

	var input struct {
		Name        string  `json:"name"`
		Description string  `json:"description"`
		Price       float64 `json:"price"`
		Category    string  `json:"category"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		ContexJsonResponse(c, "Error on data parse.", http.StatusBadRequest, nil, err)
		return
	}

	ingredient := models.Ingredient{}

	ingredient.Name = input.Name
	ingredient.Description = input.Description
	ingredient.Price = input.Price
	ingredient.Category = input.Category
	ingredient.Available = false

	result := models.GORMDB.Select("name", "description", "price", "category", "available").Create(&ingredient)

	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on ingredient creation", http.StatusInternalServerError, nil, result.Error)
		return
	}
	ContexJsonResponse(c, "Ingredients created successfully", 200, ingredient, nil)
}

// Get all ingredients
func GetAllIngredientsHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}

	var ingredients []models.Ingredient

	result := models.GORMDB.Find(&ingredients)
	if result.Error != nil {
		ContexJsonResponse(c, "Error on ingredients search", http.StatusInternalServerError, nil, result.Error)
		return
	}

	var distinctCategories []string

	distinct_result := models.GORMDB.Table("ingredients").Distinct("category").Find(&distinctCategories)
	if distinct_result.Error != nil {
		ContexJsonResponse(c, "Error on distinct ingrediets search", http.StatusInternalServerError, nil, distinct_result.Error)
		return
	}
	var data struct {
		Ingredients []models.Ingredient
		Categories  []string
	}
	data.Ingredients = ingredients

	data.Categories = distinctCategories
	ContexJsonResponse(c, "Ingredients fetched successfully", 200, data, nil)

}

// Get single ingredient by id
func GetSingleIngredientByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}

	id, _ := lib.GetIdFromHash(c.Param("id"))

	var ingredient models.Ingredient

	result := models.GORMDB.Table("ingredients").First(&ingredient, id)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on ingredient fetch", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Ingredient fetched successfully", 200, ingredient, nil)
	return
}

// Delete single ingredient by id
func DeleteIngredientByIdHandler(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete requests here, nothing else!")
		return
	}

	var ingredient models.Ingredient

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)

	ingredient.ID = uint(id)
	if err != nil {
		ContexJsonResponse(c, "Error on id parse", 500, nil, err)
		return
	}

	result := models.GORMDB.Table("ingredients").Delete(&ingredient)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on ingredient delete", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Ingredient deleted successfully", 200, result, result.Error)
}

// Update an ingredient by id
func UpdateIngredientValuesByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")
	// JSON input from query
	// name: ""
	// description: ""
	// price: 0.0
	// category: ""

	var input struct {
		Name        string  `json:"name"`
		Description string  `json:"description"`
		Price       float64 `json:"price"`
		Category    string  `json:"category"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		ContexJsonResponse(c, "Error on data parse.", http.StatusBadRequest, nil, err)
		return
	}

	var ingredient models.Ingredient
	models.GORMDB.First(&ingredient, id)

	ingredient.Name = input.Name
	ingredient.Description = input.Description
	ingredient.Price = input.Price
	ingredient.Category = input.Category

	if ingredient.ID == 0 {
		ContexJsonResponse(c, "Product availability changed  failed, no such an ID available", 500, nil, nil)
		return
	}
	models.GORMDB.Save(&ingredient)

	ContexJsonResponse(c, "Product updated successfully", 200, ingredient, nil)
	return
}

// Change Availability of ingredient by id
func ChangeAvailabilityOfIngredientByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}

	// Int in params :id
	id := c.Param("id")

	// Get ingredient
	var ingredient models.Ingredient
	models.GORMDB.First(&ingredient, id)

	if ingredient.Available {
		ingredient.Available = false
	} else {
		ingredient.Available = true
	}

	if ingredient.ID == 0 {
		ContexJsonResponse(c, "Product availability changed  failed, no such an ID available", 500, nil, nil)
		return
	}
	result := models.GORMDB.Save(&ingredient)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product update", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Product availability changed  successfully", 200, ingredient, nil)
	return
}
