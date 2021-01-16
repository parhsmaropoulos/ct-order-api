// Product core class and all extenders
package models

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Product struct {
	ID                    primitive.ObjectID `bson:"_id" json:"id"`
	Name                  string             `json:"name"`
	Description           string             `json:"description"`
	Price                 float64            `json:"price"`
	Category              string             `json:"category"`
	Image                 string             `json:"image"`
	Choices               []Choice           `json:"choices"`
	Ingredients_Ids       []string           `json:"Ingrdients"`
	Extra_Ingredients_Ids []string           `json:"Extra_Ingredients"`
	Available             bool               `json:"available"`
	Quantity              int8               `json:"quantity"`
}

func CreateProduct(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}
	c.Header("Access-Control-Allow-Origin", "*")
	var input Product
	// var input struct {
	// 	file    string
	// 	product Product
	// }
	// if err := c.ShouldBindJSON(&input); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": err})
	// 	return
	// }

	// AUTH CHECK
	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	_, err = FetchAuth(tokenAuth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	// Parse input
	c.Request.ParseMultipartForm(10 << 20)
	// Retrieve file

	file, handler, err := c.Request.FormFile("file")
	// c.SaveUploadedFile(file, "saved/"+file.Filename)
	if err != nil {
		log.Fatal(err)
	}

	// Write temporary file
	tempFile, err := ioutil.TempFile("images", "upload-*.png")
	if err != nil {
		fmt.Println(err)
	}
	defer tempFile.Close()

	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Println(err)
	}
	tempFile.Write(fileBytes)

	// Save to db
	// Initialize bucket
	bucket, err := gridfs.NewBucket(Images)
	if err != nil {
		log.Fatal(err)
	}
	uploadStream, err := bucket.OpenUploadStream(
		handler.Filename,
	)
	defer uploadStream.Close()

	_, err = uploadStream.Write(fileBytes)
	if err != nil {
		log.Fatal(err)
	}

	// Get the product values
	data := c.Request.FormValue("data")
	err = json.Unmarshal([]byte(data), &input)

	if err != nil {
		log.Fatal(err)
	}

	product := Product{
		ID:                    primitive.NewObjectID(),
		Name:                  input.Name,
		Price:                 input.Price,
		Description:           input.Description,
		Category:              input.Category,
		Image:                 handler.Filename,
		Choices:               []Choice{},
		Ingredients_Ids:       []string{},
		Extra_Ingredients_Ids: []string{},
	}
	if input.Ingredients_Ids != nil {
		product.Ingredients_Ids = input.Ingredients_Ids
	}
	if input.Extra_Ingredients_Ids != nil {
		product.Extra_Ingredients_Ids = input.Extra_Ingredients_Ids
	}

	product.Price = math.Round((product.Price * 100) / 100)
	// product = product.AddChoices()
	_, err = Products.InsertOne(context.Background(), product)
	if err != nil {
		log.Fatal(err)
	}
	// Append product to proper category.
	// old_category := Products_Categories.FindOneAndUpdate(
	cat, errs := Products_Categories.UpdateOne(
		context.Background(),
		bson.M{"name": input.Category},
		bson.M{"$push": bson.M{"products": product}},
		options.Update(),
	)

	if errs != nil {
		// ErrNoDocuments means that the filter did not match any documents in the collection
		if errs == mongo.ErrNoDocuments {
			return
		}
		log.Fatal(errs)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product  created successfully so did the category updated",
		"data":    product,
		"new_cat": cat,
	})
}

func UpdateProduct(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}
	c.Header("Access-Control-Allow-Origin", "*")
	var input Product
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": err})
		return
	}

	// AUTH CHECK
	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	_, err = FetchAuth(tokenAuth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	// CHOICES TO UPDATE
	// General (price, name, desc, etc...)
	// GeneralUpdate()
	// Image
	// ImageUpdate()
}

func GetProducts(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here man.")
		return
	}
	// c.Header("Access-Control-Allow-Origin", "*")

	products := []Product{}

	cursor, err := Products.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.Background(), &products); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Products found",
		"data":    products,
	})
}

func GetSingleProduct(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here no give!")
		return
	}

	var product Product

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Products.FindOne(context.Background(), bson.M{"_id": id}).Decode(&product)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Product not found!",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Product found",
		"data":    product,
	})
}

func DeleteProduct(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete here nothing else!")
		return
	}

	var product Product

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Products.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&product)

	if err != nil {
		c.JSON(404, gin.H{
			"message": "Product not found",
		})
		return
	}

	c.JSON(200, gin.H{
		"message":        "Product deleted",
		"delete_product": product,
	})
}

func (prod Product) AddChoice(id string, choice Choice) bool {
	id_hex, errs := primitive.ObjectIDFromHex(id)
	if errs != nil {
		return false
	}

	// TODO need this as return?
	_, err := Products.UpdateByID(
		context.Background(),
		id_hex,
		bson.M{
			"$push": bson.M{
				"choices": choice,
			},
		},
		options.Update(),
	)
	if err != nil {
		return false
	}

	return true
}

func (prod Product) AddIngredient(id string, ingredient Ingredient) bool {
	id_hex, errs := primitive.ObjectIDFromHex(id)
	if errs != nil {
		return false
	}

	// TODO need this as return?
	_, err := Products.UpdateByID(
		context.Background(),
		id_hex,
		bson.M{
			"$push": bson.M{
				"ingredients": ingredient,
			},
		},
		options.Update(),
	)
	if err != nil {
		return false
	}

	return true
}

func (prod Product) AddChoices() Product {
	category_name := prod.Category

	var prod_cat Product_Category

	Products_Categories.FindOne(
		context.Background(),
		bson.M{"name": category_name},
	).Decode(&prod_cat)

	for _, choice := range prod_cat.Choices {
		prod.Choices = append(prod.Choices, choice)
	}

	return prod
}

// func (prod Product) GetFile() Product {
// 	category_name := prod.Category

// 	var prod_cat Product_Category

// 	Products_Categories.FindOne(
// 		context.Background(),
// 		bson.M{"name": category_name},
// 	).Decode(&prod_cat)

// 	for _, choice := range prod_cat.Choices {
// 		prod.Choices = append(prod.Choices, choice)
// 	}

// 	return prod
// }
