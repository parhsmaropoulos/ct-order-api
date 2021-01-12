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
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Order struct {
	Products    []Product `json:"products"`
	Product_Ids []string  `json:"product_ids"`
	Accepted    bool      `json:"accepted"`
	User_id     string    `json:"user_id"`

	Pre_Discount_Price   float64    `json:"pre_discount_price"`
	After_Discount_Price float64    `json:"after_discount_price"`
	Payment_Type         string     `json:"payment_type"`
	Discounts            []Discount `json:"discounts"`
	Discounts_ids        []string   `json:"discounts_ids"`
	Tips                 float64    `json:"tips"`

	Comment Comment `json:"comment"`
	Rating  Rating  `json:"rating"`

	Completed  bool      `json:"completed"`
	Canceled   bool      `json:"canceled"`
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

	order := Order{
		Products:      []Product{},
		Accepted:      false,
		Payment_Type:  input.Payment_Type,
		Discounts_ids: []string{},
		Discounts:     []Discount{},
		Tips:          input.Tips,
		Created_at:    time.Now(),
		Comment:       Comment{},
		Rating:        Rating{},
		User_id:       input.User_id,
		Canceled:      false,
		Completed:     false,
	}

	if input.Discounts_ids != nil {
		order.Discounts_ids = input.Discounts_ids
	}
	// Append Products
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
	// Appends Discounts
	for _, disc_id := range input.Discounts_ids {
		var curr_disc Discount

		id, errs := primitive.ObjectIDFromHex(disc_id)
		if errs != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Server error1!",
			})
			return
		}
		err := Discounts.FindOne(context.Background(), bson.M{"_id": id}).Decode(&curr_disc)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Product not found!",
			})
		} else {
			order.Discounts = append(order.Discounts, curr_disc)
		}

	}

	var user User
	user_id, err1 := primitive.ObjectIDFromHex(input.User_id)
	if err1 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error2!",
			"error":   err1.Error(),
		})
		return
	}
	//TODO  Append Order to User
	_, err := Users.UpdateOne(
		context.Background(),
		bson.M{"_id": user_id},
		bson.M{
			"$push": bson.M{
				"orders": order,
			},
		},
		options.Update(),
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "User not found!",
		})
	}

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

func GetOrders(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here man.")
		return
	}

	orders := []Order{}

	cursor, err := Orders.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.Background(), &orders); err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Orders found",
		"data":    orders,
	})
}

func GetSingleOrder(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get here no give!")
		return
	}

	var order Order

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Orders.FindOne(context.Background(), bson.M{"_id": id}).Decode(&order)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Order not found!",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Order found",
		"data":    order,
	})
}

func DeleteOrder(c *gin.Context) {
	if c.Request.Method != "DELETE" {
		fmt.Println("Only delete here nothing else!")
		return
	}

	var order Order

	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
	if errs != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error!",
		})
		return
	}

	err := Orders.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&order)

	if err != nil {
		c.JSON(404, gin.H{
			"message": "Order not found",
		})
		return
	}

	c.JSON(200, gin.H{
		"message":        "Order deleted",
		"delete_product": order,
	})
}

func (order Order) AcceptOrder(id string) bool {
	id_hex, errs := primitive.ObjectIDFromHex(id)
	if errs != nil {
		return false
	}

	// TODO need this as return?
	_, err := Orders.UpdateByID(
		context.Background(),
		id_hex,
		bson.M{
			"$set": bson.M{
				"accepted": true,
			},
		},
		options.Update(),
	)
	if err != nil {
		return false
	}

	return true
}

func (order Order) CommentOrder(id string, comm Comment) bool {
	id_hex, errs := primitive.ObjectIDFromHex(id)
	if errs != nil {
		return false
	}

	// TODO need this as return?
	_, err := Orders.UpdateByID(
		context.Background(),
		id_hex,
		bson.M{
			"$set": bson.M{
				"comment": comm,
			},
		},
		options.Update(),
	)
	if err != nil {
		return false
	}

	return true
}

func (order Order) RateOrder(id string, rate Rating) bool {
	id_hex, errs := primitive.ObjectIDFromHex(id)
	if errs != nil {
		return false
	}

	// TODO need this as return?
	_, err := Orders.UpdateByID(
		context.Background(),
		id_hex,
		bson.M{
			"$set": bson.M{
				"rating": rate,
			},
		},
		options.Update(),
	)
	if err != nil {
		return false
	}

	return true
}

func (order Order) CancelOrder(id string) bool {
	id_hex, errs := primitive.ObjectIDFromHex(id)
	if errs != nil {
		return false
	}

	// TODO need this as return?
	_, err := Orders.UpdateByID(
		context.Background(),
		id_hex,
		bson.M{
			"$set": bson.M{
				"canceled": true,
			},
		},
		options.Update(),
	)
	if err != nil {
		return false
	}

	return true
}

func (order Order) AnswerComment(id string, text string) bool {
	id_hex, errs := primitive.ObjectIDFromHex(id)
	if errs != nil {
		return false
	}

	// TODO need this as return?
	_, err := Orders.UpdateByID(
		context.Background(),
		id_hex,
		bson.M{
			"$set": bson.M{
				"comment.answer": text,
			},
		},
		options.Update(),
	)
	if err != nil {
		return false
	}

	return true
}
