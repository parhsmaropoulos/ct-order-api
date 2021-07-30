package handlers

import (
	models "GoProjects/CoffeeTwist/backend/models"
	"bytes"
	"encoding/json"
	"fmt"
	"image"
	"image/png"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"strings"

	resize "github.com/nfnt/resize"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

// Get all products
func GetAllProductsHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	rows, err := models.DB.Query(` SELECT * FROM products ;`)
	if err != nil {
		fmt.Print(err.Error())
		log.Fatal(err)
	}

	var products []models.Product
	var product models.Product
	for rows.Next() {
		var tmp struct {
			id                  int64
			name                string
			description         string
			price               float64
			image               string
			choices_id          []int64
			custom              bool
			available           bool
			visible             bool
			category_id         int
			ingredients_id      []int64
			default_ingredients []string
		}

		rows.Scan(&tmp.id, &tmp.name, &tmp.description, &tmp.price, &tmp.image, pq.Array(&tmp.choices_id),
			&tmp.custom, &tmp.available, &tmp.visible, &tmp.category_id, pq.Array(&tmp.ingredients_id), pq.Array(&tmp.default_ingredients))

		product.BaseProduct.Available = tmp.available
		product.BaseProduct.Category_id = tmp.category_id
		product.BaseProduct.Choices_id = tmp.choices_id
		product.BaseProduct.Custom = tmp.custom
		product.BaseProduct.Description = tmp.description
		product.BaseProduct.Image = tmp.image
		product.BaseProduct.Ingredients_id = tmp.ingredients_id
		product.BaseProduct.Name = tmp.name
		product.BaseProduct.Price = tmp.price
		product.BaseProduct.Visible = tmp.visible
		product.BaseProduct.Default_Ingredients = tmp.default_ingredients
		product.ID = tmp.id

		products = append(products, product)
	}

	// usersBytes, _ := json.MarshalIndent(users, "", "\t")
	// defer rows.Close()
	// defer db.Close()

	c.JSON(http.StatusOK, gin.H{
		"message": "Products fetched successfully",
		"data":    products,
	})

}

// Register a new user
func RegisterProductHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// JSON input from query
	// product : {}
	var input models.BaseProduct

	// For iamge
	var imageName string = ""
	c.Request.ParseMultipartForm(10 << 20)
	// Check if there is a  file
	if len(c.Request.MultipartForm.File) != 0 {

		// Retrieve file
		file, handler, err := c.Request.FormFile("file")
		// c.SaveUploadedFile(file, "saved/"+file.Filename)
		fmt.Println("Got Here")
		if err != nil {
			log.Fatal(err)
		}
		filename := fmt.Sprintf("%s-*.png", strings.Split(handler.Filename, ".")[0])
		// Write temporary file
		tempFile, err := ioutil.TempFile("assets/images", filename)
		if err != nil {
			fmt.Println(err)
		}
		defer tempFile.Close()
		imageName = strings.Split(tempFile.Name(), "\\")[2]
		fileBytes, err := ioutil.ReadAll(file)
		if err != nil {
			fmt.Println(err)
		}
		img, _, _ := image.Decode(bytes.NewReader(fileBytes))

		resized := resize.Thumbnail(100, 100, img, resize.NearestNeighbor)
		errs := png.Encode(tempFile, resized)
		if errs != nil {
			log.Fatal(errs)
		}
	}

	// 	// Get the product values
	data := c.Request.FormValue("data")
	err := json.Unmarshal([]byte(data), &input)

	if err != nil {
		log.Fatal(err)
	}

	input.Image = imageName

	input.Price = math.Round((input.Price * 100) / 100)

	sqlStatement := `INSERT INTO products (name , description, price
		,image, choices_id, custom, available, visible, category_id, ingredients_ids, default_ingredients)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id;`
	_, err = models.DB.Exec(sqlStatement, input.Name, input.Description, input.Price, input.Image, pq.Array(input.Choices_id), input.Custom, false, true, input.Category_id, pq.Array(input.Ingredients_id), pq.Array(input.Default_Ingredients)) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on registration",
		})
		fmt.Print(err)
		panic(err)
	}
	// defer db.Close()
	c.JSON(http.StatusOK, gin.H{
		"message": "Product created successfully",
		"data":    input,
	})
}

// Get single product by id
func GetSingleProductByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")

	rows, err := models.DB.Query(` SELECT * FROM products where id = $1;`, id)
	if err != nil {
		log.Fatal(err)
	}

	var product models.Product
	for rows.Next() {
		var tmp struct {
			id                  int64
			name                string
			description         string
			price               float64
			image               string
			choices_id          []int64
			custom              bool
			available           bool
			visible             bool
			category_id         int
			ingredients_id      []int64
			default_ingredients []string
		}

		rows.Scan(&tmp.id, &tmp.name, &tmp.description, &tmp.price, &tmp.image, pq.Array(&tmp.choices_id),
			&tmp.custom, &tmp.available, &tmp.visible, &tmp.category_id, pq.Array(&tmp.ingredients_id), pq.Array(&tmp.default_ingredients))

		product.BaseProduct.Available = tmp.available
		product.BaseProduct.Category_id = tmp.category_id
		product.BaseProduct.Choices_id = tmp.choices_id
		product.BaseProduct.Custom = tmp.custom
		product.BaseProduct.Description = tmp.description
		product.BaseProduct.Image = tmp.image
		product.BaseProduct.Ingredients_id = tmp.ingredients_id
		product.BaseProduct.Name = tmp.name
		product.BaseProduct.Price = tmp.price
		product.BaseProduct.Visible = tmp.visible
		product.BaseProduct.Default_Ingredients = tmp.default_ingredients
		product.ID = tmp.id
	}

	// usersBytes, _ := json.MarshalIndent(users, "", "\t")
	// defer rows.Close()
	// defer db.Close()

	c.JSON(http.StatusOK, gin.H{
		"message": "Products fetched successfully",
		"data":    product,
	})

}

// Delete single product by id
func DeleteProductByIdHandler(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")

	_, err := models.DB.Query(` DELETE FROM products where id = $1;`, id)
	if err != nil {
		log.Fatal(err)
	}

	// usersBytes, _ := json.MarshalIndent(users, "", "\t")
	// defer rows.Close()
	// defer db.Close()

	c.JSON(http.StatusOK, gin.H{
		"message": "Product deleted successfully",
	})

}

// Update choices of product by id
func AddChoiceToProductByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()
	// defer db.Close()

	// Int in params :id
	id := c.Param("id")

	// JSON input from request
	// choice_id
	var input struct {
		Choice_id int64 `json:"choice_id"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sqlStatement := `update products set choices_id = array_append(choices_id, $1) where id = $2;`
	_, err := models.DB.Exec(sqlStatement, input.Choice_id, id) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on update user",
		})
		fmt.Print(err)
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product choice added to product successfully",
	})

}

// Change Availability of product by id
func ChangeAvailabilityOfProductByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// Int in params :id
	id := c.Param("id")

	sqlStatement := `update products set available = NOT available where id = $1;`
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
	var input models.BaseProduct

	// For iamge
	var imageName string = ""
	c.Request.ParseMultipartForm(10 << 20)
	// Check if there is a  file
	// if len(c.Request.MultipartForm.File) != 0 {

	// 	// Retrieve file
	// 	file, handler, err := c.Request.FormFile("file")
	// 	// c.SaveUploadedFile(file, "saved/"+file.Filename)
	// 	fmt.Println("Got Here")
	// 	if err != nil {
	// 		log.Fatal(err)
	// 	}
	// 	filename := fmt.Sprintf("%s-*.png", strings.Split(handler.Filename, ".")[0])
	// 	// Write temporary file
	// 	tempFile, err := ioutil.TempFile("assets/images", filename)
	// 	if err != nil {
	// 		fmt.Println(err)
	// 	}
	// 	defer tempFile.Close()
	// 	imageName = strings.Split(tempFile.Name(), "\\")[2]
	// 	fileBytes, err := ioutil.ReadAll(file)
	// 	if err != nil {
	// 		fmt.Println(err)
	// 	}
	// 	img, _, _ := image.Decode(bytes.NewReader(fileBytes))

	// 	resized := resize.Thumbnail(100, 100, img, resize.NearestNeighbor)
	// 	errs := png.Encode(tempFile, resized)
	// 	if errs != nil {
	// 		log.Fatal(errs)
	// 	}
	// }

	// 	// Get the product values
	data := c.Request.FormValue("data")
	err := json.Unmarshal([]byte(data), &input)

	if err != nil {
		log.Fatal(err)
	}

	input.Image = imageName

	input.Price = math.Round((input.Price * 100) / 100)

	sqlStatement := `update products set name = $1, description = $2, price=$3, image=$4, choices_id=$5, custom=$6,category_id=$7,ingredients_ids=$8 , default_ingredients=$10 where id = $9;`
	_, err = models.DB.Exec(sqlStatement, input.Name, input.Description, input.Price, input.Image, pq.Array(input.Choices_id), input.Custom, input.Category_id, pq.Array(input.Ingredients_id), id, pq.Array(input.Default_Ingredients)) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on update user",
		})
		fmt.Print(err)
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product updated successfully",
	})
	return
}
