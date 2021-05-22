package models

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"log"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
)

func PostImage(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}
	c.Header("Access-Control-Allow-Origin", "*")
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

	c.JSON(200, "Done")
}

func GetImage(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}
	c.Header("Access-Control-Allow-Origin", "*")
	fileName := c.PostForm("name")
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

	fsFiles := Images.Collection("fs.files")
	var results bson.M

	err := fsFiles.FindOne(context.Background(), bson.M{}).Decode(&results)
	if err != nil {
		log.Fatal(err)
	}
	// you can print out the results
	// fmt.Println(results)

	bucket, _ := gridfs.NewBucket(
		Images,
	)
	var buf bytes.Buffer
	dStream, err := bucket.DownloadToStreamByName(fileName, &buf)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("File size to download: %v\n", dStream)
	ioutil.WriteFile(fileName, buf.Bytes(), 0600)
}
