// Orders
package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

type UserDetails struct {
	Name       string `json:"name"`
	Surname    string `json:"surname"`
	Address_id int64  `json:"address_id"`
	Phone      int64  `json:"phone"`
	Bell_name  string `json:"bell_name"`
	Floor      string `json:"floor"`
}

type OrderProduct struct {
	Comment           string   `json:"comment"`
	Price             float64  `json:"price"`
	Extra_Price       float64  `json:"extraPrice"`
	Extra_Ingredients []string `json:"extra_ingredients"`
	// Item              Product  `json:"item"`
	Item_Name string `json:"item_name"`
	// Option_Answers []string `json:"optionAnswers"`
	Options []struct {
		Name   string  `json:"name"`
		Choice string  `json:"choice"`
		Price  float64 `json:"price"`
	} `json:"options"`
	Quantity    int32   `json:"quantity"`
	Total_Price float64 `json:"totalPrice"`
}

type BaseOrder struct {
	Products      []OrderProduct `json:"products"`
	Accepted      bool           `json:"accepted"`
	User_id       int            `json:"user_id"`
	Delivery_type string         `json:"delivery_type"`

	Pre_Discount_Price   float64 `json:"pre_discount_price"`
	After_Discount_Price float64 `json:"after_discount_price"`
	Payment_Type         string  `json:"payment_type"`
	// Discounts            []Discount `json:"discounts"`
	Discounts_ids []int64 `json:"discounts_ids"`
	Tips          float64 `json:"tips"`
	Comments      string  `json:"comments"`

	User_Details  UserDetails `json:"user_details"`
	Delivery_time int32       `json:"delivery_time"`
	Rating_id     int64       `json:"rating_id"`
	// Rating        struct {
	// 	Rate    float32            `json:"rate"`
	// 	User_ID primitive.ObjectID `json:"user_id"`
	// } `json:"rating"`
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

func (c OrderProduct) Value() (driver.Value, error) {
	return json.Marshal(c)
}

func (c *OrderProduct) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(b, &c)
}

type Order struct {
	ID        int64     `json:"id"`
	BaseOrder BaseOrder `json:"base_order"`
	// ID        primitive.ObjectID `bson:"_id" json:"id"`
	// Products      []OrderProduct     `json:"products"`
	// Accepted      bool               `json:"accepted"`
	// User_id       string             `json:"user_id"`
	// Delivery_type string             `json:"delivery_type"`

	// Pre_Discount_Price   float64    `json:"pre_discount_price"`
	// After_Discount_Price float64    `json:"after_discount_price"`
	// Payment_Type         string     `json:"payment_type"`
	// Discounts            []Discount `json:"discounts"`
	// Discounts_ids        []string   `json:"discounts_ids"`
	// Tips                 float64    `json:"tips"`
	// Comments             string     `json:"comments"`

	// User_Details  UserDetails `json:"user_details"`
	// Delivery_time int32       `json:"delivery_time"`
	// Rating        struct {
	// 	Rate    float32            `json:"rate"`
	// 	User_ID primitive.ObjectID `json:"user_id"`
	// } `json:"rating"`
	// Comment struct {
	// 	Comment  string `json:"comment_text"`
	// 	Answer   string `json:"comment_answer"`
	// 	Approved bool   `json:"approved"`
	// } `json:"comment"`

	// Completed  bool      `json:"completed"`
	// Canceled   bool      `json:"canceled"`
	// Created_at time.Time `json:"create_at"`
	// // Delay_Time Timer or Time???
}

// func CreateOrder(c *gin.Context) {
// 	if c.Request.Method != "POST" {
// 		fmt.Println("Only put here man.")
// 		return
// 	}
// 	// fmt.Println(c.Request.Body)
// 	var input Order
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	order := Order{
// 		ID:                 primitive.NewObjectID(),
// 		Products:           input.Products,
// 		Accepted:           false,
// 		Payment_Type:       input.Payment_Type,
// 		Pre_Discount_Price: input.Pre_Discount_Price,
// 		Delivery_type:      input.Delivery_type,
// 		Discounts_ids:      []string{},
// 		Discounts:          []Discount{}, Tips: input.Tips,
// 		Created_at:    time.Now(),
// 		Comments:      input.Comments,
// 		User_id:       input.User_id,
// 		Canceled:      false,
// 		Completed:     false,
// 		User_Details:  input.User_Details,
// 		Delivery_time: input.Delivery_time,
// 	}

// 	if input.Discounts_ids != nil {
// 		order.Discounts_ids = input.Discounts_ids
// 	}
// 	// Appends Discounts
// 	for _, disc_id := range input.Discounts_ids {
// 		var curr_disc Discount

// 		id, errs := primitive.ObjectIDFromHex(disc_id)
// 		if errs != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{
// 				"message": "Server error1!",
// 			})
// 			return
// 		}
// 		err := Discounts.FindOne(context.Background(), bson.M{"_id": id}).Decode(&curr_disc)
// 		if err != nil {
// 			c.JSON(http.StatusNotFound, gin.H{
// 				"message": "Product not found!",
// 			})
// 		} else {
// 			order.Discounts = append(order.Discounts, curr_disc)
// 		}

// 	}

// 	// var user User
// 	user_id, err1 := primitive.ObjectIDFromHex(input.User_id)
// 	if err1 != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Server error2!",
// 			"error":   err1.Error(),
// 		})
// 		return
// 	}
// 	// GET user from token?? TODO
// 	// Users.FindOne(context.Background(), bson.M{"_id": user_id}).Decode(&user)

// 	// userDetails := UserDetails{
// 	// 	Name:      user.Name,
// 	// 	Surname:   user.Surname,
// 	// 	Phone:     input.Phone,
// 	// 	Address:   input.Address,
// 	// 	Floor:     input.Floor,
// 	// 	Bell_name: input.Bell_name,
// 	// }

// 	// Append Order to User
// 	_, err := Users.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": user_id},
// 		bson.M{
// 			"$push": bson.M{
// 				"orders_ids": order.ID,
// 				"orders":     order,
// 			},
// 			"$set": bson.M{
// 				"last_order": order,
// 			},
// 		},
// 		options.Update(),
// 	)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "User not found!",
// 		})
// 	}

// 	_, err = Orders.InsertOne(context.Background(), order)
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message":      "Order has been created!",
// 		"order":        order,
// 		"user_details": order.User_Details,
// 	})
// }

// func GetOrders(c *gin.Context) {
// 	if c.Request.Method != "GET" {
// 		fmt.Println("Only get here man.")
// 		return
// 	}

// 	orders := []Order{}

// 	cursor, err := Orders.Find(context.Background(), bson.D{})
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	if err = cursor.All(context.Background(), &orders); err != nil {
// 		log.Fatal(err)
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Orders found",
// 		"data":    orders,
// 	})
// }

// func GetSingleOrder(c *gin.Context) {
// 	if c.Request.Method != "GET" {
// 		fmt.Println("Only get here no give!")
// 		return
// 	}

// 	var order Order

// 	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
// 	if errs != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Server error!",
// 		})
// 		return
// 	}

// 	err := Orders.FindOne(context.Background(), bson.M{"_id": id}).Decode(&order)

// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "Order not found!",
// 		})
// 		return
// 	}

// 	c.JSON(200, gin.H{
// 		"message": "Order found",
// 		"data":    order,
// 	})
// }

// func DeleteOrder(c *gin.Context) {
// 	if c.Request.Method != "DELETE" {
// 		fmt.Println("Only delete here nothing else!")
// 		return
// 	}

// 	var order Order

// 	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
// 	if errs != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Server error!",
// 		})
// 		return
// 	}

// 	err := Orders.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&order)

// 	if err != nil {
// 		c.JSON(404, gin.H{
// 			"message": "Order not found",
// 		})
// 		return
// 	}

// 	c.JSON(200, gin.H{
// 		"message":        "Order deleted",
// 		"delete_product": order,
// 	})
// }

// func UpdateOrder(c *gin.Context) {
// 	if c.Request.Method != "PUT" {
// 		fmt.Println("Only put here man.")
// 		return
// 	}
// 	var input struct {
// 		Order_ID string `json:"order_id"`
// 		// Order  Order  `json:"order"`
// 		Reason       string `json:"reason"`
// 		Comment_Text string `json:"comment_text"`
// 		User_name    string `json:"user_name"`
// 		Rating       Rating `json:"rating"`
// 		Answer       string `json:"answer"`
// 	}
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": err})
// 		return
// 	}

// 	// id_hex, _ := primitive.ObjectIDFromHex(input.Comment.User_ID)
// 	// if errs != nil {
// 	// 	return
// 	// }
// 	order_id_hex, _ := primitive.ObjectIDFromHex(input.Order_ID)
// 	// if errs != nil {
// 	// 	return
// 	// }
// 	var order Order
// 	err := Orders.FindOne(context.Background(), bson.M{"_id": order_id_hex}).Decode(&order)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "Order not found!",
// 		})
// 		return
// 	}

// 	var er error
// 	switch input.Reason {
// 	case "accept_order":
// 		er = order.AcceptOrder(order_id_hex)
// 	case "comment_order":
// 		er = order.CommentOrder(order_id_hex, input.Comment_Text, input.Rating, input.User_name)
// 	case "cancel_order":
// 		er = order.CancelOrder(order_id_hex)
// 	case "rate_order":
// 		er = order.RateOrder(order_id_hex, input.Rating)
// 	case "answer_comment":
// 		er = order.AnswerComment(order_id_hex, input.Answer)
// 	case "approve_comment":
// 		er = order.ApproveComment(order_id_hex, true)
// 	case "disapprove_comment":
// 		er = order.ApproveComment(order_id_hex, false)
// 	default:
// 		return
// 	}

// 	if er != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "Something went wrong!",
// 			"error":   er,
// 		})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Order  updated successfully",
// 	})

// }

// func (order Order) AcceptOrder(id primitive.ObjectID) error {
// 	// id_hex, errs := primitive.ObjectIDFromHex(id)
// 	// if errs != nil {
// 	// 	return errs
// 	// }

// 	// TODO need this as return?
// 	_, err := Orders.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": id},
// 		bson.M{
// 			"$set": bson.M{
// 				"accepted": true,
// 			},
// 		},
// 		options.Update(),
// 	)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (order Order) CommentOrder(id primitive.ObjectID, text string, rate Rating, user_name string) error {

// 	user_id_hex, errs := primitive.ObjectIDFromHex(rate.User_id)
// 	if errs != nil {
// 		return errs
// 	}
// 	comment := Comment{
// 		ID:         primitive.NewObjectID(),
// 		Text:       text,
// 		Answer:     "",
// 		Approved:   false,
// 		User_id:    user_id_hex,
// 		User_name:  user_name,
// 		Order_id:   id,
// 		Rate:       rate.Rate,
// 		Created_at: time.Now().Local(),
// 	}
// 	Comments.InsertOne(context.Background(), comment)

// 	_, err := Users.UpdateOne(context.Background(), bson.M{"_id": comment.User_id}, bson.M{"$push": bson.M{"comments": comment}})

// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (order Order) ApproveComment(id primitive.ObjectID, approve bool) error {
// 	// id_hex, errs := primitive.ObjectIDFromHex(id)
// 	// if errs != nil {
// 	// 	return errs
// 	// }

// 	// TODO need this as return?
// 	_, err := Orders.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": id},
// 		bson.M{
// 			"$set": bson.M{
// 				"comment.approved": approve,
// 			},
// 		},
// 		options.Update(),
// 	)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (order Order) RateOrder(id primitive.ObjectID, rate Rating) error {
// 	// id_hex, errs := primitive.ObjectIDFromHex(id)
// 	// if errs != nil {
// 	// 	return errs
// 	// }

// 	// TODO need this as return?
// 	_, err := Orders.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": id},
// 		bson.M{
// 			"$set": bson.M{
// 				"rating": rate,
// 			},
// 		},
// 		options.Update(),
// 	)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (order Order) CancelOrder(id primitive.ObjectID) error {
// 	// id_hex, errs := primitive.ObjectIDFromHex(id)
// 	// if errs != nil {
// 	// 	return errs
// 	// }

// 	// TODO need this as return?
// 	_, err := Orders.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": id},
// 		bson.M{
// 			"$set": bson.M{
// 				"canceled": true,
// 			},
// 		},
// 		options.Update(),
// 	)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (order Order) AnswerComment(id primitive.ObjectID, text string) error {
// 	// id_hex, errs := primitive.ObjectIDFromHex(id)
// 	// if errs != nil {
// 	// 	return errs
// 	// }

// 	// TODO need this as return?
// 	_, err := Orders.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": id},
// 		bson.M{
// 			"$set": bson.M{
// 				"comment.answer": text,
// 			},
// 		},
// 		options.Update(),
// 	)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func AcceptOrder(c *gin.Context) {
// 	if c.Request.Method != "PUT" {
// 		fmt.Println("Only get here nothing else!")
// 		return
// 	}

// 	var input struct {
// 		Delivery_time int32 `json:"delivery_time"`
// 	}
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": err})
// 		return
// 	}

// 	id, err := primitive.ObjectIDFromHex(c.Param("id"))
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "order acceptance error",
// 			"error":   err,
// 		})
// 	}

// 	_, err = Orders.UpdateOne(context.Background(), bson.M{"_id": id}, bson.M{"$set": bson.M{"accepted": true, "delivery_time": input.Delivery_time}})
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "order acceptance error",
// 			"error":   err,
// 		})
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "order accepted",
// 	})
// }

// func RejectOrder(c *gin.Context) {
// 	if c.Request.Method != "PUT" {
// 		fmt.Println("Only get here nothing else!")
// 		return
// 	}
// 	id, err := primitive.ObjectIDFromHex(c.Param("id"))
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "order rejection error",
// 			"error":   err,
// 		})
// 	}

// 	_, err = Orders.UpdateOne(context.Background(), bson.M{"_id": id}, bson.M{"$set": bson.M{"canceled": true}})
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "order rejection error",
// 			"error":   err,
// 		})
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "order rejected",
// 	})
// }

// func CompleteOrder(c *gin.Context) {
// 	if c.Request.Method != "PUT" {
// 		fmt.Println("Only get here nothing else!")
// 		return
// 	}
// 	id, err := primitive.ObjectIDFromHex(c.Param("id"))
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "order completetion error",
// 			"error":   err,
// 		})
// 	}

// 	_, err = Orders.UpdateOne(context.Background(), bson.M{"_id": id}, bson.M{"$set": bson.M{"completed": true}})
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "order completetion error",
// 			"error":   err,
// 		})
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "order completed",
// 	})
// }

// // func getOrdersByTimeSpan

// func GetTodayOrders(c *gin.Context) {
// 	if c.Request.Method != "GET" {
// 		fmt.Println("Only get here nothing else!")
// 		return
// 	}
// 	date := time.Now().Local()
// 	// date.Local().AddDate(0, 0, 1)

// 	startDay := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, time.UTC)
// 	endDay := time.Date(date.Year(), date.Month(), date.Day(), 23, 59, 59, 0, time.UTC)

// 	// start, err := time.Parse("2006-01-02T00:00:00Z", startDay)
// 	// end, err := time.Parse("2006-01-02T00:00:00Z", endDay)

// 	filter := bson.M{
// 		"created_at": bson.M{
// 			"$gte": startDay,
// 			"$lte": endDay,
// 		},
// 	}
// 	orders := []Order{}

// 	cursor, err := Orders.Find(context.Background(), filter)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "error on order fetch",
// 			"error":   err,
// 		})
// 	}

// 	if err = cursor.All(context.Background(), &orders); err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "error on order fetch",
// 			"error":   err,
// 		})
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Orders found",
// 		"data":    orders,
// 		"start":   startDay,
// 		"end":     endDay,
// 		"filter":  filter,
// 	})
// }
