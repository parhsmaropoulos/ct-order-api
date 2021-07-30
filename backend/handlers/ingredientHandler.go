package handlers

import (
	"GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"log"
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
	// available: bool

	var input models.BaseIngredient
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	sqlStatement := `INSERT INTO ingredients (name , price , description , category, available) VALUES ($1,$2,$3, $4,$5);`
	_, err := models.DB.Exec(sqlStatement, input.Name, input.Price, input.Description, input.Category, input.Available) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on registration",
		})
		fmt.Print(err)
		panic(err)
	}
	ingredient := models.Ingredient{}
	ingredient.BaseIngredient = input

	ContexJsonResponse(c, "Ingredients created successfully", 200, ingredient)
	// c.JSON(http.StatusOK, gin.H{
	// 	"message": "Ingredient created successfully",
	// 	"data":    ingredient,
	// })
	// defer db.Close()
	return
}

// Get all ingredients
func GetAllIngredientsHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	rows, err := models.DB.Query(` SELECT * FROM ingredients order by category;`)
	if err != nil {
		log.Fatal(err)
	}

	var ingredients []models.Ingredient
	var ingredient models.Ingredient
	for rows.Next() {
		var tmp struct {
			id          int64
			name        string
			price       float64
			description string
			category    string
			available   bool
		}

		rows.Scan(&tmp.id, &tmp.name, &tmp.price, &tmp.description, &tmp.category, &tmp.available)

		ingredient.ID = tmp.id
		ingredient.BaseIngredient.Name = tmp.name
		ingredient.BaseIngredient.Available = tmp.available
		ingredient.BaseIngredient.Category = tmp.category
		ingredient.BaseIngredient.Description = tmp.description
		ingredient.BaseIngredient.Price = tmp.price

		ingredients = append(ingredients, ingredient)
	}

	// usersBytes, _ := json.MarshalIndent(users, "", "\t")
	rows, err = models.DB.Query(` SELECT distinct(category) FROM ingredients;`)
	if err != nil {
		log.Fatal(err)
	}
	var distinctCategories []string
	for rows.Next() {
		var tmpS string
		rows.Scan(&tmpS)

		distinctCategories = append(distinctCategories, tmpS)
	}
	// c.JSON(http.StatusOK, gin.H{
	// 	"message":    "Ingredients fetched successfully",
	// 	"data":       ingredients,
	// 	"categories": distinctCategories,
	// })
	var data struct {
		Ingredients []models.Ingredient
		Categories  []string
	}
	data.Ingredients = ingredients
	data.Categories = distinctCategories
	ContexJsonResponse(c, "Ingredients fetched successfully", 200, data)

	// defer rows.Close()
	// defer db.Close()
}

// Get single ingredient by id
func GetSingleIngredientByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")

	rows, err := models.DB.Query(` SELECT * FROM ingredients where id = $1;`, id)
	if err != nil {
		log.Fatal(err)
	}

	var ingredient models.Ingredient
	for rows.Next() {
		var tmp struct {
			id          int64
			name        string
			price       float64
			description string
			category    string
			available   bool
		}

		rows.Scan(&tmp.id, &tmp.name, &tmp.price, &tmp.description, &tmp.category, &tmp.available)

		ingredient.BaseIngredient.Name = tmp.name
		ingredient.BaseIngredient.Price = tmp.price
		ingredient.BaseIngredient.Description = tmp.description
		ingredient.BaseIngredient.Category = tmp.category
		ingredient.BaseIngredient.Available = tmp.available

	}

	// usersBytes, _ := json.MarshalIndent(users, "", "\t")

	c.JSON(http.StatusOK, gin.H{
		"message": "Ingredient fetched successfully",
		"data":    ingredient,
	})

	// defer rows.Close()
	// defer db.Close()
}

// Delete single ingredient by id
func DeleteIngredientByIdHandler(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")

	_, err := models.DB.Query(` DELETE FROM ingredients where id = $1;`, id)
	if err != nil {
		log.Fatal(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Ingredient deleted successfully",
	})

	// defer rows.Close()
	// defer db.Close()
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

	var input models.BaseIngredient
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	sqlStatement := `UPDATE  ingredients  SET name =$1 , price=$2 , description=$3 , category=$4 where id= $5;`
	_, err := models.DB.Exec(sqlStatement, input.Name, input.Price, input.Description, input.Category, id) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on registration",
		})
		fmt.Print(err)
		panic(err)
	}
	ingredient := models.Ingredient{}
	ingredient.BaseIngredient = input
	ingredient.ID, err = strconv.ParseInt(id, 10, 64)
	c.JSON(http.StatusOK, gin.H{
		"message": "Ingredient updated successfully",
		"data":    ingredient,
	})
	// defer db.Close()
	return
}

// Change Availability of ingredient by id
func ChangeAvailabilityOfIngredientByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()
	// defer db.Close()

	// Int in params :id
	id := c.Param("id")

	sqlStatement := `update ingredients set available = NOT available where id = $1;`
	_, err := models.DB.Exec(sqlStatement, id) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on update user",
		})
		fmt.Print(err)
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product availability changed  successfully",
	})
	return
}
