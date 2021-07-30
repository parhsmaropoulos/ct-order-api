package models

type BaseCategory struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type Product_Category struct {
	// ID           primitive.ObjectID `bson:"_id" json:"id"`

	ID int64 `bson:"_id" json:"id"`

	BaseCategory BaseCategory `json:"base_category"`
	// Name        string             `json:"name"`
	// Description string             `json:"description"`
	// Image       string             `json:"image"`
}

// func CreateProductCategory(c *gin.Context) {
// 	if c.Request.Method != "POST" {
// 		fmt.Println("Only put here man.")
// 		return
// 	}

// 	var input Product_Category
// 	var imageName string = ""

// 	c.Request.ParseMultipartForm(10 << 20)

// 	if len(c.Request.MultipartForm.File) != 0 {

// 		// Retrieve file

// 		file, handler, err := c.Request.FormFile("file")
// 		// c.SaveUploadedFile(file, "saved/"+file.Filename)
// 		fmt.Println("Got Here")
// 		if err != nil {
// 			log.Fatal(err)
// 		}
// 		filename := fmt.Sprintf("%s-*.png", strings.Split(handler.Filename, ".")[0])
// 		// Write temporary file
// 		tempFile, err := ioutil.TempFile("assets/images", filename)
// 		if err != nil {
// 			fmt.Println(err)
// 		}
// 		defer tempFile.Close()
// 		imageName = strings.Split(tempFile.Name(), "\\")[2]
// 		fileBytes, err := ioutil.ReadAll(file)
// 		if err != nil {
// 			fmt.Println(err)
// 		}
// 		img, _, _ := image.Decode(bytes.NewReader(fileBytes))
// 		// img, err_img := jpeg.Decode(file)
// 		// if err_img != nil {
// 		// 	log.Fatal(err_img)
// 		// }
// 		// jpeg.Encode(tempFile, resized, nil)

// 		resized := resize.Thumbnail(100, 100, img, resize.NearestNeighbor)
// 		errs := png.Encode(tempFile, resized)
// 		if errs != nil {
// 			log.Fatal(errs)
// 		}
// 	}

// 	data := c.Request.FormValue("data")
// 	err := json.Unmarshal([]byte(data), &input)

// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	prod_cat := Product_Category{
// 		ID:          primitive.NewObjectID(),
// 		Name:        input.Name,
// 		Description: input.Description,
// 		Image:       imageName}

// 	Products_Categories.InsertOne(context.Background(), prod_cat)

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Product category created successfully",
// 		"data":    prod_cat,
// 	})
// }

// func GetProductCategories(c *gin.Context) {
// 	if c.Request.Method != "GET" {
// 		fmt.Println("Only get here man.")
// 		return
// 	}
// 	c.Header("Access-Control-Allow-Origin", "*")

// 	categories := []Product_Category{}

// 	cursor, err := Products_Categories.Find(context.Background(), bson.D{})
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	if err = cursor.All(context.Background(), &categories); err != nil {
// 		log.Fatal(err)
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Categories found",
// 		"data":    categories,
// 	})
// }

// // NEED THIS?????
// func GetSingleCategory(c *gin.Context) {
// 	if c.Request.Method != "GET" {
// 		fmt.Println("Only get here no give!")
// 		return
// 	}

// 	var category Product_Category

// 	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
// 	if errs != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Server error!",
// 		})
// 		return
// 	}

// 	err := Products_Categories.FindOne(context.Background(), bson.M{"_id": id}).Decode(&category)

// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "Product Category not found!",
// 		})
// 		return
// 	}

// 	c.JSON(200, gin.H{
// 		"message": "Product Category found",
// 		"data":    category,
// 	})
// }

// func DeleteProductCategory(c *gin.Context) {
// 	if c.Request.Method != "DELETE" {
// 		fmt.Println("Only delete here nothing else!")
// 		return
// 	}

// 	var category Product_Category

// 	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
// 	if errs != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Server error!",
// 		})
// 		return
// 	}

// 	err := Products_Categories.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&category)

// 	if err != nil {
// 		c.JSON(404, gin.H{
// 			"message": "Product category not found",
// 		})
// 		return
// 	}

// 	c.JSON(200, gin.H{
// 		"message":                 "Product category deleted",
// 		"delete_product_category": category,
// 	})
// }
