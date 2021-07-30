package handlers

import (
	"GoProjects/CoffeeTwist/backend/models"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Register a new user
func RegisterProductCategoryHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// JSON input from query
	// category : {}
	var input models.BaseCategory

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

	sqlStatement := `INSERT INTO product_categories (name , description , image) VALUES ($1,$2,$3);`
	_, err = models.DB.Exec(sqlStatement, input.Name, input.Description, input.Image) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on creation",
		})
		fmt.Print(err)
		panic(err)
	}
	category := models.Product_Category{}
	category.BaseCategory = input

	c.JSON(http.StatusOK, gin.H{
		"message": "User created successfully",
		"data":    category,
	})
	// defer db.Close()
	return
}

// Get all product categories
func GetAllProductCategoriesHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	rows, err := models.DB.Query(` SELECT * FROM product_categories ;`)
	if err != nil {
		log.Fatal(err)
	}

	var product_categories []models.Product_Category
	var product_category models.Product_Category
	for rows.Next() {
		var tmp struct {
			id          int64
			name        string
			description string
			image       string
		}

		rows.Scan(&tmp.id, &tmp.name, &tmp.description, &tmp.image)

		product_category.ID = tmp.id
		product_category.BaseCategory.Name = tmp.name
		product_category.BaseCategory.Description = tmp.description
		product_category.BaseCategory.Image = tmp.image

		product_categories = append(product_categories, product_category)
	}

	// usersBytes, _ := json.MarshalIndent(users, "", "\t")

	c.JSON(http.StatusOK, gin.H{
		"message": "Products fetched successfully",
		"data":    product_categories,
	})

	// defer rows.Close()
	// defer db.Close()
}

// Delete single product category by id
func DeleteProductCategoryByIdHandler(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")

	_, err := models.DB.Query(` DELETE FROM product_categorires where id = $1;`, id)
	if err != nil {
		log.Fatal(err)
	}

	// usersBytes, _ := json.MarshalIndent(users, "", "\t")

	c.JSON(http.StatusOK, gin.H{
		"message": "Product deleted successfully",
	})

	// defer rows.Close()
	// defer db.Close()
}
