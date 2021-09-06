package handlers

import (
	models "GoProjects/CoffeeTwist/backend/models"
	"bytes"
	"encoding/json"
	"fmt"
	"image"
	_ "image/jpeg"
	"image/png"
	"io/ioutil"
	"math"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nfnt/resize"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// Get all products
func GetAllProductsHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}

	var products []models.Product

	result := models.GORMDB.Preload("Choices.Options").Preload(clause.Associations).Find(&products)
	if result.Error != nil {
		ContexJsonResponse(c, "Error on products search", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Products fetched successfully", 200, products, nil)
}

// Register a new product
func RegisterProductHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}

	var product models.Product
	// For iamge
	var imageName string = ""
	c.Request.ParseMultipartForm(10 << 20)
	// Check if there is a  file
	if len(c.Request.MultipartForm.File) != 0 {
		// Retrieve file
		file, handler, err := c.Request.FormFile("file")
		// c.SaveUploadedFile(file, "saved/"+file.Filename)
		if err != nil {
			ContexJsonResponse(c, "Error on form file read", 500, nil, err)
			return
		}
		filename := fmt.Sprintf("%s-*.png", strings.Split(handler.Filename, ".")[0])
		// Write temporary file
		tempFile, err := ioutil.TempFile("assets/images", filename)
		if err != nil {
			ContexJsonResponse(c, "Error on tmp file creation", 500, nil, err)
			return
		}

		defer tempFile.Close()
		imageName = strings.Split(tempFile.Name(), "\\")[2]
		_, err = file.Seek(0, 0)
		if err != nil {
			ContexJsonResponse(c, "Error on seek file method", 500, nil, err)
			return
		}
		fileBytes, err := ioutil.ReadAll(file)
		if err != nil {
			ContexJsonResponse(c, "Error on file read", 500, nil, err)
			return
		}
		// img, _, err := image.Decode(file)
		bytesBuffer := bytes.NewBuffer(fileBytes)
		img, _, err := image.Decode(bytesBuffer)
		if err != nil {
			ContexJsonResponse(c, "Error on image decode", 500, nil, err)
			return
		}
		resized := resize.Thumbnail(100, 100, img, resize.NearestNeighbor)
		errs := png.Encode(tempFile, resized)
		if errs != nil {
			ContexJsonResponse(c, "Error on image encode to file", 500, nil, errs)
			return
		}
	}

	// 	// Get the product values
	product.Name = c.Request.FormValue("name")
	product.Description = c.Request.FormValue("description")
	product.Price, _ = strconv.ParseFloat(c.Request.FormValue("price"), 64)

	// Get choices ids
	var choice_ids []int64
	choices_ := c.Request.FormValue("choices_id")
	if err := json.Unmarshal([]byte(choices_), &choice_ids); err != nil {
		ContexJsonResponse(c, "Error on choices_id unmarshal", 500, nil, err)
		return
	}
	var choices []models.Choice
	// Find choices
	res := models.GORMDB.Table("choices").Find(&choices, choice_ids)
	if res.Error != nil {
		ContexJsonResponse(c, "Error on choices search", 500, nil, res.Error)
		return
	}
	product.Choices = choices

	// Get ingredients ids
	var ingredient_ids []int64

	ingredients_ := c.Request.FormValue("ingredients_id")
	if err := json.Unmarshal([]byte(ingredients_), &ingredient_ids); err != nil {
		ContexJsonResponse(c, "Error on ingredients unmarshal", 500, nil, err)
		return
	}

	var ingredients []models.Ingredient
	// Find ingredients
	res = models.GORMDB.Table("ingredients").Find(&ingredients, ingredient_ids)
	if res.Error != nil {
		ContexJsonResponse(c, "Error on ingredients  search", 500, nil, res.Error)
		return
	}
	product.Ingredients = ingredients
	// choicess_ := c.Request.FormValue("choices")
	// if err := json.Unmarshal([]byte(choicess_), &product.Choices); err != nil {
	// 	ContexJsonResponse(c, "Error on choices unmarshal", 500, nil, err)
	// 	return
	// }

	// ingredientss_ := c.Request.FormValue("ingredients")
	// if err := json.Unmarshal([]byte(ingredientss_), &product.Ingredients); err != nil {
	// 	ContexJsonResponse(c, "Error on ingredients unmarshal", 500, nil, err)
	// 	return
	// }

	product.Custom, _ = strconv.ParseBool(c.Request.FormValue("custom"))
	product.Category_id, _ = strconv.ParseInt(c.Request.FormValue("category_id"), 10, 64)

	default_ingredients_ := c.Request.FormValue("default_ingredients")
	if err := json.Unmarshal([]byte(default_ingredients_), &product.Default_Ingredients); err != nil {
		ContexJsonResponse(c, "Error on default_ingredients unmarshal", 500, nil, err)
		return
	}

	product.Image = imageName

	product.Price = math.Round((product.Price * 100) / 100)

	result := models.GORMDB.Create(&product)

	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product creation", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Products created successfully", 200, product, nil)
}

// Get single product by id
func GetSingleProductByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")

	var product models.Product

	result := models.GORMDB.Preload(clause.Associations).Table("products").First(&product, id)

	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product fetch", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Product fetched successfully", 200, product, nil)
}

// Delete single product by id
func DeleteProductByIdHandler(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete requests here, nothing else!")
		return
	}

	var product models.Product

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		ContexJsonResponse(c, "Internal server error on id parse", 500, nil, err)
		return
	}

	product.ID = uint(id)

	result := models.GORMDB.Table("products").Delete(&product)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product delete", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Product deleted successfully", 200, product, nil)
}

// Update choices of product by id
// func AddChoiceToProductByIdHandler(c *gin.Context) {
// 	if c.Request.Method != "PUT" {
// 		fmt.Println("Only put requests here, nothing else!")
// 		return
// 	}
// 	// db := models.OpenConnection()
// 	// defer db.Close()

// 	// Int in params :id
// 	id := c.Param("id")

// 	// JSON input
// 	// choice_id: int
// 	var input struct {
// 		Choice_id int64 `json:"choice_id"`
// 	}
// 	err := c.ShouldBindJSON(&input)
// 	if err != nil {
// 		ContexJsonResponse(c, "Error on data parse", 500, nil, err)
// 		return
// 	}

// 	// Get product
// 	var product models.Product
// 	models.GORMDB.First(&product, id)
// 	if product.ID == 0 {
// 		ContexJsonResponse(c, "Product availability changed  failed, no such an ID available", 500, nil, nil)
// 		return
// 	}

// 	// Add choice id
// 	product.Choices_id = append(product.Choices_id, input.Choice_id)

// 	result := models.GORMDB.Save(&product)
// 	if result.Error != nil {
// 		ContexJsonResponse(c, "Internal server error on product update", 500, nil, result.Error)
// 		return
// 	}

// 	ContexJsonResponse(c, "Added new choice to product successfully", 200, product, nil)

// }

// Change Availability of product by id
func ChangeAvailabilityOfProductByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// Int in params :id
	id := c.Param("id")

	// Get product
	var product models.Product
	models.GORMDB.First(&product, id)

	if product.Available {
		product.Available = false
	} else {
		product.Available = true
	}

	if product.ID == 0 {
		ContexJsonResponse(c, "Product availability changed  failed, no such an ID available", 500, nil, nil)
		return
	}
	result := models.GORMDB.Save(&product)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product update", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Product availability changed", 200, product, nil)
}

// Update product values by id
func UpdateProductValuesByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()
	// defer db.Close()

	// Int in params :id
	id := c.Param("id")

	// JSON input from query
	// product : {}
	var product models.Product

	// For iamge
	var imageName string = ""
	c.Request.ParseMultipartForm(10 << 20)
	// Check if there is a  file
	if len(c.Request.MultipartForm.File) != 0 {

		// Retrieve file
		file, handler, err := c.Request.FormFile("file")
		// c.SaveUploadedFile(file, "saved/"+file.Filename)
		if err != nil {
			ContexJsonResponse(c, "Error on form file read", 500, nil, err)
			return
		}
		filename := fmt.Sprintf("%s-*.png", strings.Split(handler.Filename, ".")[0])
		// Write temporary file
		tempFile, err := ioutil.TempFile("assets/images", filename)
		if err != nil {
			ContexJsonResponse(c, "Error on tmp file creation", 500, nil, err)
			return
		}

		defer tempFile.Close()
		imageName = strings.Split(tempFile.Name(), "\\")[2]
		_, err = file.Seek(0, 0)
		if err != nil {
			ContexJsonResponse(c, "Error on seek file method", 500, nil, err)
			return
		}
		fileBytes, err := ioutil.ReadAll(file)
		if err != nil {
			ContexJsonResponse(c, "Error on file read", 500, nil, err)
			return
		}
		// img, _, err := image.Decode(file)
		bytesBuffer := bytes.NewBuffer(fileBytes)
		img, _, err := image.Decode(bytesBuffer)
		if err != nil {
			ContexJsonResponse(c, "Error on image decode", 500, nil, err)
			return
		}
		resized := resize.Thumbnail(100, 100, img, resize.NearestNeighbor)
		errs := png.Encode(tempFile, resized)
		if errs != nil {
			ContexJsonResponse(c, "Error on image encode to file", 500, nil, errs)
			return
		}
	}

	// Get product
	result := models.GORMDB.Table("products").First(&product, id)
	if result.Error != nil {
		ContexJsonResponse(c, "No such product", 500, nil, result.Error)
	}

	// 	// Get the product values
	product.Name = c.Request.FormValue("name")
	product.Description = c.Request.FormValue("description")
	product.Price, _ = strconv.ParseFloat(c.Request.FormValue("price"), 64)

	// Get choices ids
	var choice_ids []int64
	choices_ := c.Request.FormValue("choices_id")
	if err := json.Unmarshal([]byte(choices_), &choice_ids); err != nil {
		ContexJsonResponse(c, "Error on choices_id unmarshal", 500, nil, err)
		return
	}
	var choices []models.Choice
	// Find choices
	if len(choice_ids) != 0 {
		res := models.GORMDB.Table("choices").Find(&choices, choice_ids)
		if res.Error != nil {
			ContexJsonResponse(c, "Error on choices search", 500, nil, res.Error)
			return
		}
	}
	models.GORMDB.Model(&product).Association("Choices").Replace(choices)

	// Get ingredients ids
	var ingredient_ids []int64

	ingredients_ := c.Request.FormValue("ingredients_id")
	if err := json.Unmarshal([]byte(ingredients_), &ingredient_ids); err != nil {
		ContexJsonResponse(c, "Error on ingredients unmarshal", 500, nil, err)
		return
	}

	var ingredients []models.Ingredient
	// Find ingredients
	if len(ingredient_ids) != 0 {
		res := models.GORMDB.Table("ingredients").Find(&ingredients, ingredient_ids)
		if res.Error != nil {
			ContexJsonResponse(c, "Error on ingredients  search", 500, nil, res.Error)
			return
		}
	}
	models.GORMDB.Model(&product).Association("Ingredients").Replace(ingredients)

	product.Custom, _ = strconv.ParseBool(c.Request.FormValue("custom"))
	product.Category_id, _ = strconv.ParseInt(c.Request.FormValue("category_id"), 10, 64)

	default_ingredients_ := c.Request.FormValue("default_ingredients")
	if err := json.Unmarshal([]byte(default_ingredients_), &product.Default_Ingredients); err != nil {
		ContexJsonResponse(c, "Error on default_ingredients unmarshal", 500, nil, err)
		return
	}

	product.Image = imageName

	product.Price = math.Round((product.Price * 100) / 100)

	// result = models.GORMDB.Save(&product)
	result = models.GORMDB.Session(&gorm.Session{FullSaveAssociations: true}).Save(&product)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product update", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Product updated", 200, product, nil)
}
