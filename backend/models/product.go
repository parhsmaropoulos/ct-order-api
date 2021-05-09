// Product core class and all extenders
package models

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"image"
	"image/png"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nfnt/resize"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Product struct {
	ID          primitive.ObjectID `bson:"_id" json:"id"`
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Price       float64            `json:"price"`
	Category    string             `json:"category"`
	Image       string             `json:"image"`
	Ingredients []string           `json:"ingredients"`
	Choices     []Choice           `json:"choices"`
	Custom      bool               `json:"custom"`
	// Ingredients_Ids       []string           `json:"Ingrdients"`
	Extra_Ingredients []Ingredient `json:"extra_ingredients"`
	Available         bool         `json:"available"`
	Visible           bool         `json:"visible"`
	// Quantity  int8 `json:"quantity"`
}

func CreateProduct(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}
	var input Product
	var imageName string = ""
	// AUTH CHECK
	// tokenAuth, err := ExtractTokenMetadata(c.Request)
	// if err != nil {
	// 	c.JSON(http.StatusUnauthorized, "unauthorized")
	// 	return
	// }
	// _, err = FetchAuth(tokenAuth)
	// if err != nil {
	// 	c.JSON(http.StatusUnauthorized, "unauthorized")
	// 	return
	// }
	// Parse input
	c.Request.ParseMultipartForm(10 << 20)
	// Check if there is a file
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
		// img, err_img := jpeg.Decode(file)
		// if err_img != nil {
		// 	log.Fatal(err_img)
		// }
		// jpeg.Encode(tempFile, resized, nil)

		resized := resize.Thumbnail(100, 100, img, resize.NearestNeighbor)
		errs := png.Encode(tempFile, resized)
		if errs != nil {
			log.Fatal(errs)
		}
	}

	// Get the product values
	data := c.Request.FormValue("data")
	err := json.Unmarshal([]byte(data), &input)

	if err != nil {
		log.Fatal(err)
	}

	product := Product{
		ID:          primitive.NewObjectID(),
		Name:        input.Name,
		Price:       input.Price,
		Description: input.Description,
		Category:    input.Category,
		Image:       imageName,
		Choices:     input.Choices,
		Custom:      input.Custom,
	}

	if len(input.Ingredients) > 0 {
		product.Ingredients = input.Ingredients
	}
	if len(input.Extra_Ingredients) > 0 {
		product.Extra_Ingredients = input.Extra_Ingredients
	}

	product.Price = math.Round((product.Price * 100) / 100)
	_, err = Products.InsertOne(context.Background(), product)
	if err != nil {
		log.Fatal(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product  created successfully so did the category updated",
		"data":    product,
	})
}

func UpdateProduct(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put here man.")
		return
	}
	var input struct {
		ID      string  `json:"id"`
		Product Product `json:"product"`
		Reason  string  `json:"reason"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": err})
		return
	}

	product := input.Product
	// fmt.Println(input.Reason)
	// AUTH CHECK
	// tokenAuth, err := ExtractTokenMetadata(c.Request)
	// if err != nil {
	// 	c.JSON(http.StatusUnauthorized, "unauthorized")
	// 	return
	// }
	// _, err = FetchAuth(tokenAuth)
	// if err != nil {
	// 	c.JSON(http.StatusUnauthorized, "unauthorized")
	// 	return
	// }
	var err error
	switch input.Reason {
	case "change_availability":
		err = product.ChangeAvailability(input.ID, !(product.Available))
		product.Available = !product.Available
	case "update_product":
		err = product.UpdateProductValue(input.ID)
	default:
		return
	}

	if err != nil {
		log.Fatal(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product  updated successfully",
		"data":    product,
	})
}

func GetProducts(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here man.")
		return
	}
	// c.Header("Access-Control-Allow-Origin", "*")

	// var gridfs *mgo.GridFS
	products := []Product{}

	cursor, err := Products.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.Background(), &products); err != nil {
		log.Fatal(err)
	}
	// for _,prod := range products {
	// 	filename := prod.Image
	// 	f, err := gridfs.Open(filename)
	// }

	// res, _ := http.Get("http://localhost:8080/products/choices")
	// fmt.Println(res)

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

func (prod Product) ChangeAvailability(id string, av bool) error {
	id_hex, errs := primitive.ObjectIDFromHex(id)
	if errs != nil {
		return errs
	}
	// fmt.Println("here")
	// fmt.Println(av)
	prod.Available = av
	_, err := Products.UpdateOne(
		context.Background(),
		bson.M{"_id": id_hex},
		bson.M{
			"$set": bson.M{
				"available": av,
			},
		},
		options.Update(),
	)
	if err != nil {
		return err
	}

	return nil
}

func (prod Product) UpdateProductValue(id string) error {
	id_hex, errs := primitive.ObjectIDFromHex(id)
	if errs != nil {
		return errs
	}

	_, err := Products.UpdateOne(
		context.Background(),
		bson.M{"_id": id_hex},
		bson.M{"$set": bson.M{
			"name":        prod.Name,
			"description": prod.Description,
			"price":       prod.Price,
			"category":    prod.Category,
			"choices":     prod.Choices,
			"custom":      prod.Custom,
			"ingredients": prod.Ingredients,
		}},
		options.Update(),
	)
	if err != nil {
		return err
	}

	return nil
}
