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

type UserDetails struct {
	Name      string
	Surname   string
	Address   Address
	Phone     string
	Bell_name string
	Floor     string
}

type OrderProduct struct {
	Comment        string   `json:"comment"`
	Extra_Price    float32  `json:"extraPrice"`
	Item           Product  `json:"item"`
	Option_Answers []string `json:"optionAnswers"`
	Options        []struct {
		Name   string
		Choice string
		Price  float32
	} `json:"options"`
	Quantity    int8    `json:"quantity"`
	Total_Price float32 `json:"totalPrice"`
}

type Order struct {
	ID            primitive.ObjectID `bson:"_id" json:"id"`
	Products      []OrderProduct     `json:"products"`
	Accepted      bool               `json:"accepted"`
	User_id       string             `json:"user_id"`
	Delivery_type string             `json:"delivery_type"`

	Pre_Discount_Price   float64    `json:"pre_discount_price"`
	After_Discount_Price float64    `json:"after_discount_price"`
	Payment_Type         string     `json:"payment_type"`
	Discounts            []Discount `json:"discounts"`
	Discounts_ids        []string   `json:"discounts_ids"`
	Tips                 float64    `json:"tips"`
	Comments             string     `json:"comments"`

	// user details
	Address   Address `json:"address"`
	Phone     string  `json:"phone"`
	Bell_name string  `json:"bell_name"`
	Floor     string  `json:"floor"`

	// Comment Comment `json:"comment"`
	Rating  Rating `json:"rating"`
	Comment struct {
		Comment  string `json:"comment_text"`
		Answer   string `json:"comment_answer"`
		Approved bool   `json:"approved"`
	} `json:"comment"`

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
	// fmt.Println(c.Request.Body)
	var input Order
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	order := Order{
		ID:                 primitive.NewObjectID(),
		Products:           input.Products,
		Accepted:           false,
		Address:            input.Address,
		Payment_Type:       input.Payment_Type,
		Pre_Discount_Price: input.Pre_Discount_Price,
		Delivery_type:      input.Delivery_type,
		Discounts_ids:      []string{},
		Discounts:          []Discount{},
		Phone:              input.Phone,
		Bell_name:          input.Bell_name,
		Floor:              input.Floor,
		Tips:               input.Tips,
		Created_at:         time.Now(),
		Comments:           input.Comments,
		// Comment:            Comment{ID: primitive.NewObjectID()},
		Rating:    Rating{ID: primitive.NewObjectID()},
		User_id:   input.User_id,
		Canceled:  false,
		Completed: false,
	}

	if input.Discounts_ids != nil {
		order.Discounts_ids = input.Discounts_ids
	}
	// Append Products
	// for _, prod_id := range input.Product_Ids {
	// 	var curr_prod Product
	// 	fmt.Println(prod_id)
	// 	id, errs := primitive.ObjectIDFromHex(prod_id)
	// 	if errs != nil {
	// 		c.JSON(http.StatusInternalServerError, gin.H{
	// 			"message": "Server error1!",
	// 		})
	// 		return
	// 	}
	// 	err := Products.FindOne(context.Background(), bson.M{"_id": id}).Decode(&curr_prod)
	// 	if err != nil {
	// 		c.JSON(http.StatusNotFound, gin.H{
	// 			"message": "Product not found!",
	// 		})
	// 	} else {
	// 		order.Products = append(order.Products, curr_prod)
	// 	}

	// }
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
	// GET user from token?? TODO
	Users.FindOne(context.Background(), bson.M{"_id": user_id}).Decode(&user)

	userDetails := UserDetails{
		Name:      user.Name,
		Surname:   user.Surname,
		Phone:     input.Phone,
		Address:   input.Address,
		Floor:     input.Floor,
		Bell_name: input.Bell_name,
	}

	// Append Order to User
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
		"user_details": userDetails,
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

func UpdateOrder(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put here man.")
		return
	}
	var input struct {
		Order_ID string `json:"order_id"`
		// Order  Order  `json:"order"`
		Reason       string `json:"reason"`
		Comment_Text string `json:"comment_text"`
		Rating       Rating `json:"rating"`
		Answer       string `json:"answer"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": err})
		return
	}

	// id_hex, _ := primitive.ObjectIDFromHex(input.Comment.User_ID)
	// if errs != nil {
	// 	return
	// }
	order_id_hex, _ := primitive.ObjectIDFromHex(input.Order_ID)
	// if errs != nil {
	// 	return
	// }
	var order Order
	err := Orders.FindOne(context.Background(), bson.M{"_id": order_id_hex}).Decode(&order)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Order not found!",
		})
		return
	}

	var er error
	switch input.Reason {
	case "accept_order":
		er = order.AcceptOrder(order_id_hex)
	case "comment_order":
		er = order.CommentOrder(order_id_hex, input.Comment_Text, input.Rating)
	case "cancel_order":
		er = order.CancelOrder(order_id_hex)
	case "rate_order":
		er = order.RateOrder(order_id_hex, input.Rating)
	case "answer_comment":
		er = order.AnswerComment(order_id_hex, input.Answer)
	case "approve_comment":
		er = order.ApproveComment(order_id_hex, true)
	case "disapprove_comment":
		er = order.ApproveComment(order_id_hex, false)
	default:
		return
	}

	if er != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Something went wrong!",
			"error":   er,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Order  updated successfully",
		"data":    order,
	})

}

func (order Order) AcceptOrder(id primitive.ObjectID) error {
	// id_hex, errs := primitive.ObjectIDFromHex(id)
	// if errs != nil {
	// 	return errs
	// }

	// TODO need this as return?
	_, err := Orders.UpdateOne(
		context.Background(),
		bson.M{"_id": id},
		bson.M{
			"$set": bson.M{
				"accepted": true,
			},
		},
		options.Update(),
	)
	if err != nil {
		return err
	}

	return nil
}

func (order Order) CommentOrder(id primitive.ObjectID, text string, rate Rating) error {
	// id_hex, errs := primitive.ObjectIDFromHex(id)
	// if errs != nil {
	// 	return errs
	// }

	// TODO need this as return?
	_, err := Orders.UpdateOne(
		context.Background(),
		bson.M{"_id": id},
		bson.M{
			"$set": bson.M{
				"comment": bson.M{
					"comment_text": text,
					"approved":     false,
					"answer":       "",
				},
				"rating": rate,
			},
		},
		options.Update(),
	)
	if err != nil {
		return err
	}

	return nil
}

func (order Order) ApproveComment(id primitive.ObjectID, approve bool) error {
	// id_hex, errs := primitive.ObjectIDFromHex(id)
	// if errs != nil {
	// 	return errs
	// }

	// TODO need this as return?
	_, err := Orders.UpdateOne(
		context.Background(),
		bson.M{"_id": id},
		bson.M{
			"$set": bson.M{
				"comment.approved": approve,
			},
		},
		options.Update(),
	)
	if err != nil {
		return err
	}

	return nil
}

func (order Order) RateOrder(id primitive.ObjectID, rate Rating) error {
	// id_hex, errs := primitive.ObjectIDFromHex(id)
	// if errs != nil {
	// 	return errs
	// }

	// TODO need this as return?
	_, err := Orders.UpdateOne(
		context.Background(),
		bson.M{"_id": id},
		bson.M{
			"$set": bson.M{
				"rating": rate,
			},
		},
		options.Update(),
	)
	if err != nil {
		return err
	}

	return nil
}

func (order Order) CancelOrder(id primitive.ObjectID) error {
	// id_hex, errs := primitive.ObjectIDFromHex(id)
	// if errs != nil {
	// 	return errs
	// }

	// TODO need this as return?
	_, err := Orders.UpdateOne(
		context.Background(),
		bson.M{"_id": id},
		bson.M{
			"$set": bson.M{
				"canceled": true,
			},
		},
		options.Update(),
	)
	if err != nil {
		return err
	}

	return nil
}

func (order Order) AnswerComment(id primitive.ObjectID, text string) error {
	// id_hex, errs := primitive.ObjectIDFromHex(id)
	// if errs != nil {
	// 	return errs
	// }

	// TODO need this as return?
	_, err := Orders.UpdateOne(
		context.Background(),
		bson.M{"_id": id},
		bson.M{
			"$set": bson.M{
				"comment.answer": text,
			},
		},
		options.Update(),
	)
	if err != nil {
		return err
	}

	return nil
}
