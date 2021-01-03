// Product core class and all extenders
package models

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Product struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float32 `json:"price"`
	Image       []byte  `json:"image"`
	Available   bool    `json:"available"`
	Quantity    int8    `json:"quantity"`
}

type Product_Category struct {
	Name              string       `json:"name"`
	Description       string       `json:"description"`
	Products          []Product    `json:"products"`
	Choices           []Choice     `json:"choices"`
	Ingredients       []Ingredient `json:"ingredients"`
	Extra_Ingredients []Ingredient `json:"extra_ingredients"`
}

type Choice struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Choices     []struct {
		Name        string  `json:"name"`
		Description string  `json:"description"`
		Price       float32 `json:"price"`
	} `json:"choices"`
	For_Classes []string `json:"for_classes"`
}

type Ingredient struct {
	Name        string   `json:"name"`
	Price       float32  `json:"price"`
	Description string   `json:"description"`
	For_Classes []string `json:"for_classes"`
}

// type Coffee struct {
// 	Product_Core Product `json:"product_core"`
// 	Size         string  `json:"size"`
// 	Sugar        string  `json:"sugar"`
// 	Sugar_Type   string  `json:"sugar_type"`
// 	Milk         string  `json:"milk"`
// 	Syrop        string  `json:"syrup"`
// }

// type Beverages struct {
// 	Product_Core Product `json:"product_core"`
// 	Sugar        string  `json:"sugar"`
// 	Sugar_Type   string  `json:"sugar_type"`
// 	Milk         string  `json:"milk"`
// 	Syrop        string  `json:"syrup"`
// }

// type MilkShakes struct {
// 	Product_Core Product `json:"product_core"`
// 	Syrop        string  `json:"syrup"`
// }

// type Smoothies_Frozen struct {
// 	Product_Core Product `json:"product_core"`
// 	Flavor       string  `json:"flavor"`
// 	// Choices?
// }

// type Puff_Pastry struct {
// 	Product_Core Product `json:"product_core"`
// }

// type Donut_Cronut struct {
// 	Product_Core Product `json:"product_core"`
// }

// type Toast_Bread_Roll struct {
// 	Product_Core Product `json:"product_core"`
// 	// Choices?
// }

// type Baguette struct {
// 	Product_Core Product      `json:"product_core"`
// 	Ingredients  []Ingredient `json:"ingredients"`
// 	Color        string       `json:"color"`
// 	// Choice color?
// }

// type Tortillas struct {
// 	Product_Core Product      `json:"product_core"`
// 	Ingredients  []Ingredient `json:"ingredients"`
// 	// Choices?
// }

// type Sandwich struct {
// 	Product_Core Product      `json:"product_core"`
// 	Ingredients  []Ingredient `json:"ingredients"`
// }

// type Club_Sandwich struct {
// 	Product_Core      Product      `json:"product_core"`
// 	Ingredients       []Ingredient `json:"ingredients"`
// 	Extra_Ingredients []Ingredient `json:"extra_ingredients"`
// 	Dip               string       `json:"dip"`
// 	// Choices?
// }

// type Burger struct {
// 	Product_Core      Product      `json:"product_core"`
// 	Ingredients       []Ingredient `json:"ingredients"`
// 	Size              string       `json:"size"`
// 	Extra_Ingredients []Ingredient `json:"extra_ingredients"`
// }

// type Pancake struct {
// 	Size        string       `json:"size"`
// 	Ingredients []Ingredient `json:"ingredients"`
// 	// Choices?
// }

// type Sweet_Crepe_Waffle struct {
// 	Size        string       `json:"size"`
// 	Ingredients []Ingredient `json:"ingredients"`
// 	Ice_cream   []Ingredient `json:"ice_creams`
// 	// Choices?
// }

// type Savory_Crepe_Waffle struct {
// 	Size        string       `json:"size"`
// 	Ingredients []Ingredient `json:"ingredients"`
// 	// Choices?
// }

func CreateProductChoice(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}

	var input Choice
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	choice := Choice{input.Name, input.Description, input.Choices, input.For_Classes}

	Choices.InsertOne(context.Background(), choice)

	c.JSON(http.StatusOK, gin.H{
		"message": "Choice created successfully",
		"data":    choice,
	})
}

func CreateIngredient(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}

	var input Ingredient
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ingredient := Ingredient{input.Name, input.Price, input.Description, input.For_Classes}

	Ingredients.InsertOne(context.Background(), ingredient)

	c.JSON(http.StatusOK, gin.H{
		"message": "Ingredient created successfully",
		"data":    ingredient,
	})
}

func CreateProductCategory(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}

	var input Product_Category
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prod_cat := Product_Category{Name: input.Name, Description: input.Description}

	// // Get choices and append them
	// choices, err := Choices.Find(context.Background(), bson.M{"for_classes": input.Name})
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer choices.Close(context.Background())
	// for choices.Next(context.Background()) {
	// 	var result Choice
	// 	err := choices.Decode(&result)
	// 	if err != nil {
	// 		log.Fatal(err)
	// 	}
	// 	prod_cat.Choices = append(prod_cat.Choices, result)

	// }

	Products_Categories.InsertOne(context.Background(), prod_cat)

	c.JSON(http.StatusOK, gin.H{
		"message": "Product category created successfully",
		"data":    prod_cat,
	})
}

func CreateProduct(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}

	var input Product
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product := Product{Name: input.Name, Price: input.Price, Description: input.Description}

	Products.InsertOne(context.Background(), product)

	c.JSON(http.StatusOK, gin.H{
		"message": "Product  created successfully",
		"data":    product,
	})
}
