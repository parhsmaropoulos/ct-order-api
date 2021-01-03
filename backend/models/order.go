// Orders
package models

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Order struct {
	Products    []Product `json:"products"`
	Product_Ids []string  `json:"product_ids"`
	Accepted    bool      `json:"accepted"`
	UserID      string    `json:"user_id"`

	Pre_Discount_Price   float64    `json:"pre_discount_price"`
	After_Discount_Price float64    `json:"after_discount_price"`
	Payment_Type         string     `json:"payment_type"`
	Discounts            []Discount `json:"discounts"`
	Tips                 float64    `json:"tips"`

	Comment Comment `json:"comment"`
	Rating  Rating  `json:"rating"`

	Created_at time.Time `json:"create_at"`
	// Delay_Time Timer or Time???
}

func CreateOrder(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only put here man.")
		return
	}

	var input Order
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(input)

	order := Order{Products: []Product{}, Accepted: false, Payment_Type: input.Payment_Type, Discounts: input.Discounts, Tips: input.Tips, UserID: input.UserID}

	for _, prod_id := range input.Product_Ids {
		var curr_prod Product

		id, errs := primitive.ObjectIDFromHex(prod_id)
		if errs != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Server error1!",
			})
			return
		}
		err := Products.FindOne(context.Background(), bson.M{"_id": id}).Decode(&curr_prod)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Product not found!",
			})
		} else {
			order.Products = append(order.Products, curr_prod)
		}

	}

	var user User
	user_id, err1 := primitive.ObjectIDFromHex(input.UserID)
	if err1 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error2!",
		})
		return
	}
	err := Users.FindOne(context.Background(), bson.M{"_id": user_id}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Product not found!",
		})
	}

	//TODO  Append Order to User

	_, err = Orders.InsertOne(context.Background(), order)
	if err != nil {
		log.Fatal(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "Order is sent!",
		"order":        order,
		"user_details": user,
	})
}
