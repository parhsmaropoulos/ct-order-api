package handlers

import (
	"GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Register a new product category
func RegisterProductCategoryHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}

	var category models.Product_Category

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

	// 	// Get the category values
	category.Name = c.Request.FormValue("name")
	category.Description = c.Request.FormValue("description")
	category.Image = imageName

	result := models.GORMDB.Create(&category)

	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product category creation", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Product category created successfully", 200, category, nil)
}

// Get all product categories
func GetAllProductCategoriesHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}

	var categories []models.Product_Category

	result := models.GORMDB.Find(&categories)
	if result.Error != nil {
		ContexJsonResponse(c, "Error on product categories search", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Product categories fetched successfully", 200, categories, nil)
}

// Delete single product category by id
func DeleteProductCategoryByIdHandler(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete requests here, nothing else!")
		return
	}

	var category models.Product_Category

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		ContexJsonResponse(c, "Internal server error on id parse", 500, nil, err)
		return
	}

	category.ID = uint(id)

	result := models.GORMDB.Table("product_categories").Delete(&category)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on category delete", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Category deleted successfully", 200, category, nil)
}
