package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type ChoiceOption struct {
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

type BaseChoice struct {
	Required    bool           `json:"required"`
	Multiple    bool           `json:"multiple"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Options     []ChoiceOption `json:"options"`
}

func (c ChoiceOption) Value() (driver.Value, error) {
	return json.Marshal(c)
}

func (c *ChoiceOption) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(b, &c)
}

type Choice struct {
	// ID primitive.ObjectID `bson:"_id" json:"id"`
	ID int64 `bson:"_id" json:"id"`

	BaseChoice BaseChoice `json:"base_choice"`

	// Required    bool               `json:"required"`
	// Multiple    bool               `json:"multiple"`
	// Name        string             `json:"name"`
	// Description string             `json:"description"`
	// Options     []struct {
	// 	Name  string  `json:"name"`
	// 	Price float64 `json:"price"`
	// } `json:"options"`
}

// func CreateProductChoice(c *gin.Context) {
// 	if c.Request.Method != "POST" {
// 		fmt.Println("Only put here man.")
// 		return
// 	}

// 	var input Choice
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		fmt.Println(err)
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	choice := Choice{
// 		ID:          primitive.NewObjectID(),
// 		Name:        input.Name,
// 		Description: input.Description,
// 		Options:     input.Options,
// 		Required:    input.Required,
// 		Multiple:    input.Multiple,
// 	}

// 	for _, ch := range choice.Options {
// 		ch.Price = math.Round((ch.Price * 100) / 10)

// 	}
// 	Choices.InsertOne(context.Background(), choice)

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Choice created successfully",
// 		"data":    choice,
// 	})
// }

// func GetProductChoices(c *gin.Context) {
// 	if c.Request.Method != "GET" {
// 		fmt.Println("Only get here man.")
// 		return
// 	}

// 	choices := []Choice{}

// 	cursor, err := Choices.Find(context.Background(), bson.D{})
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	if err = cursor.All(context.Background(), &choices); err != nil {
// 		log.Fatal(err)
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Choices found",
// 		"data":    choices,
// 	})
// }

// func GetSingleChoice(c *gin.Context) {
// 	if c.Request.Method != "GET" {
// 		fmt.Println("Only get here no give!")
// 		return
// 	}

// 	var choice Choice

// 	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
// 	if errs != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Server error!",
// 		})
// 		return
// 	}

// 	err := Choices.FindOne(context.Background(), bson.M{"_id": id}).Decode(&choice)

// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "Choice not found!",
// 		})
// 		return
// 	}

// 	c.JSON(200, gin.H{
// 		"message": "Choice found",
// 		"data":    choice,
// 	})
// }

// func DeleteProductChoice(c *gin.Context) {
// 	if c.Request.Method != "DELETE" {
// 		fmt.Println("Only delete here nothing else!")
// 		return
// 	}

// 	var choice Choice

// 	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
// 	if errs != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Server error!",
// 		})
// 		return
// 	}

// 	err := Choices.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&choice)

// 	if err != nil {
// 		c.JSON(404, gin.H{
// 			"message": "Choice not found",
// 		})
// 		return
// 	}

// 	c.JSON(200, gin.H{
// 		"message":       "Choice deleted",
// 		"delete_choice": choice,
// 	})
// }

// func UpdateProductChoice(c *gin.Context) {
// 	if c.Request.Method != "PUT" {
// 		fmt.Println("Only put here man.")
// 		return
// 	}
// 	var input struct {
// 		ID     string `json:"id"`
// 		Choice Choice `json:"choice"`
// 	}
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": err})
// 		return
// 	}

// 	choice := input.Choice
// 	// AUTH CHECK
// 	// tokenAuth, err := ExtractTokenMetadata(c.Request)
// 	// if err != nil {
// 	// 	c.JSON(http.StatusUnauthorized, "unauthorized")
// 	// 	return
// 	// }
// 	// _, err = FetchAuth(tokenAuth)
// 	// if err != nil {
// 	// 	c.JSON(http.StatusUnauthorized, "unauthorized")
// 	// 	return
// 	// }
// 	id_hex, errs := primitive.ObjectIDFromHex(input.ID)
// 	if errs != nil {
// 		log.Fatal(errs)
// 	}
// 	_, err := Choices.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": id_hex},
// 		bson.M{"$set": bson.M{
// 			"required":    choice.Required,
// 			"multiple":    choice.Multiple,
// 			"name":        choice.Name,
// 			"description": choice.Description,
// 			"options":     choice.Options,
// 		}},
// 		options.Update(),
// 	)

// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Choice  updated successfully",
// 		"data":    choice,
// 	})
// }
