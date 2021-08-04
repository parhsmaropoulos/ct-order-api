package handlers

import (
	"GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Create a new order
func RegisterOrderHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}

	var input models.Order

	if err := c.ShouldBindJSON(&input); err != nil {
		ContexJsonResponse(c, "Error on data parse.", http.StatusBadRequest, nil, err)
		return
	}

	input.Completed = false
	input.Canceled = false
	input.Accepted = false

	result := models.GORMDB.Table("orders").Save(&input)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on order creation", http.StatusInternalServerError, nil, result.Error)
		return
	}
	ContexJsonResponse(c, "Order created successfully", 200, input, nil)

}

// Get all orders
func GetAllOrdersHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}

	var orders []models.Order

	result := models.GORMDB.Find(&orders)
	if result.Error != nil {
		ContexJsonResponse(c, "Error on orders search", http.StatusInternalServerError, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Orders fetched successfully", 200, orders, nil)
}

// // Get users orders by id
// func GetAllOrdersByUserIdHandler(c *gin.Context) {
// 	if c.Request.Method != "GET" {
// 		fmt.Println("Only get requests here, nothing else!")
// 		return
// 	}
// 	// db := models.OpenConnection()

// 	id := c.Param("id")

// 	rows, err := models.DB.Query(` SELECT * FROM orders where user_id = $1;`, id)
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	var orders []models.Order
// 	var order models.Order
// 	for rows.Next() {
// 		var tmp struct {
// 			id                   int64
// 			products             []models.OrderProduct
// 			accepted             bool
// 			user_id              int64
// 			delivery_type        string
// 			pre_discount_price   float64
// 			after_discount_price float64
// 			payment_type         string
// 			discounts_id         []int64
// 			tips                 float64
// 			comments             string
// 			phone                int64
// 			bell_name            string
// 			floor                string
// 			comment_id           int64
// 			completed            bool
// 			canceled             bool
// 			address_id           int64
// 			ordered_at           time.Time
// 		}

// 		rows.Scan(&tmp.id, pq.Array(&tmp.products), &tmp.accepted, &tmp.user_id, &tmp.delivery_type,
// 			&tmp.pre_discount_price, &tmp.after_discount_price, &tmp.payment_type, pq.Array(&tmp.discounts_id), &tmp.tips,
// 			&tmp.comments, &tmp.phone, &tmp.bell_name, &tmp.floor, &tmp.comment_id, &tmp.completed, &tmp.canceled, &tmp.address_id, &tmp.ordered_at)

// 		order.ID = tmp.id
// 		order.BaseOrder.Products = tmp.products
// 		order.BaseOrder.Accepted = tmp.accepted
// 		order.BaseOrder.User_id = int(tmp.user_id)
// 		order.BaseOrder.Delivery_type = tmp.delivery_type
// 		order.BaseOrder.Pre_Discount_Price = tmp.pre_discount_price
// 		order.BaseOrder.After_Discount_Price = tmp.after_discount_price
// 		order.BaseOrder.Payment_Type = tmp.payment_type
// 		order.BaseOrder.Discounts_ids = tmp.discounts_id
// 		order.BaseOrder.Tips = tmp.tips
// 		order.BaseOrder.Comments = tmp.comments
// 		order.BaseOrder.User_Details.Phone = tmp.phone
// 		order.BaseOrder.User_Details.Bell_name = tmp.bell_name
// 		order.BaseOrder.User_Details.Floor = tmp.floor
// 		order.BaseOrder.Completed = tmp.completed
// 		order.BaseOrder.Canceled = tmp.canceled
// 		order.BaseOrder.User_Details.Address_id = int64(tmp.address_id)
// 		order.BaseOrder.Created_at = tmp.ordered_at

// 		orders = append(orders, order)
// 	}

// 	// usersBytes, _ := json.MarshalIndent(users, "", "\t")

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Orders fetched successfully",
// 		"data":    orders,
// 	})

// 	// defer rows.Close()
// 	// defer db.Close()
// }

// Get single order by id
func GetSingleOrderByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")

	var order models.Order
	result := models.GORMDB.Table("orders").First(&order, id)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on order fetch", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Order fetched successfully", 200, order, nil)
	return
}

// // Accept order by id
// func AcceptOrderByIdHandler(c *gin.Context) {
// 	if c.Request.Method != "PUT" {
// 		fmt.Println("Only put requests here, nothing else!")
// 		return
// 	}
// 	// db := models.OpenConnection()

// 	id := c.Param("id")

// 	sqlStatement := `UPDATE  orders set accepted=$1 where id = $2;`
// 	_, err := models.DB.Exec(sqlStatement, true, id) //,,,,
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Internal server error on registration",
// 			"err":     err,
// 		})
// 		fmt.Print(err)
// 		panic(err)
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Order accepted successfully",
// 	})
// 	// defer db.Close()
// 	return
// }

// // Cancel order by id
// func CancelOrderByIdHandler(c *gin.Context) {
// 	if c.Request.Method != "PUT" {
// 		fmt.Println("Only put requests here, nothing else!")
// 		return
// 	}
// 	// db := models.OpenConnection()

// 	id := c.Param("id")

// 	sqlStatement := `UPDATE  orders set accepted=$1 , canceled=$2 where id = $3;`
// 	_, err := models.DB.Exec(sqlStatement, false, true, id) //,,,,
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Internal server error on registration",
// 			"err":     err,
// 		})
// 		fmt.Print(err)
// 		panic(err)
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Order canceled successfully",
// 	})
// 	// defer db.Close()
// 	return
// }

// // Complete order by id
// func CompleteOrderByIdHandler(c *gin.Context) {
// 	if c.Request.Method != "PUT" {
// 		fmt.Println("Only put requests here, nothing else!")
// 		return
// 	}
// 	// db := models.OpenConnection()

// 	id := c.Param("id")

// 	sqlStatement := `UPDATE  orders set completed=$1 where id = $2;`
// 	_, err := models.DB.Exec(sqlStatement, true, id) //,,,,
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Internal server error on registration",
// 			"err":     err,
// 		})
// 		fmt.Print(err)
// 		panic(err)
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Order completed successfully",
// 	})
// 	// defer db.Close()
// 	return
// }

// // Get today orders
// func GetTodayOrdersHandler(c *gin.Context) {
// 	if c.Request.Method != "GET" {
// 		fmt.Println("Only get requests here, nothing else!")
// 		return
// 	}
// 	// db := models.OpenConnection()

// 	rows, err := models.DB.Query(` select * from orders  where date(ordered_at) = CURRENT_DATE order by ordered_at; ;`)
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	var orders []models.Order
// 	var order models.Order
// 	for rows.Next() {
// 		var tmp struct {
// 			id                   int64
// 			products             []models.OrderProduct
// 			accepted             bool
// 			user_id              int64
// 			delivery_type        string
// 			pre_discount_price   float64
// 			after_discount_price float64
// 			payment_type         string
// 			discounts_id         []int64
// 			tips                 float64
// 			comments             string
// 			phone                int64
// 			bell_name            string
// 			floor                string
// 			comment_id           int64
// 			completed            bool
// 			canceled             bool
// 			address_id           int64
// 			ordered_at           time.Time
// 		}

// 		rows.Scan(&tmp.id, pq.Array(&tmp.products), &tmp.accepted, &tmp.user_id, &tmp.delivery_type,
// 			&tmp.pre_discount_price, &tmp.after_discount_price, &tmp.payment_type, pq.Array(&tmp.discounts_id), &tmp.tips,
// 			&tmp.comments, &tmp.phone, &tmp.bell_name, &tmp.floor, &tmp.comment_id, &tmp.completed, &tmp.canceled, &tmp.address_id, &tmp.ordered_at)

// 		order.ID = tmp.id
// 		order.BaseOrder.Products = tmp.products
// 		order.BaseOrder.Accepted = tmp.accepted
// 		order.BaseOrder.User_id = int(tmp.user_id)
// 		order.BaseOrder.Delivery_type = tmp.delivery_type
// 		order.BaseOrder.Pre_Discount_Price = tmp.pre_discount_price
// 		order.BaseOrder.After_Discount_Price = tmp.after_discount_price
// 		order.BaseOrder.Payment_Type = tmp.payment_type
// 		order.BaseOrder.Discounts_ids = tmp.discounts_id
// 		order.BaseOrder.Tips = tmp.tips
// 		order.BaseOrder.Comments = tmp.comments
// 		order.BaseOrder.User_Details.Phone = tmp.phone
// 		order.BaseOrder.User_Details.Bell_name = tmp.bell_name
// 		order.BaseOrder.User_Details.Floor = tmp.floor
// 		order.BaseOrder.Completed = tmp.completed
// 		order.BaseOrder.Canceled = tmp.canceled
// 		order.BaseOrder.User_Details.Address_id = int64(tmp.address_id)
// 		order.BaseOrder.Created_at = tmp.ordered_at

// 		orders = append(orders, order)
// 	}

// 	// usersBytes, _ := json.MarshalIndent(users, "", "\t")

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Orders fetched successfully",
// 		"data":    orders,
// 	})

// 	// defer rows.Close()
// 	// defer db.Close()
// }
