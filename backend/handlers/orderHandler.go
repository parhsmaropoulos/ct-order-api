package handlers

import (
	"GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"net/http"
	"time"

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

// Get users orders by id
func GetAllOrdersByUserIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// id := c.Param("id")

	email := c.GetString("Email")

	var user models.User

	result := models.GORMDB.Where("email = ? ", email).First(&user)

	var orders []models.Order

	result = models.GORMDB.Where("user_id = ? and completed = true", user.ID).Find(&orders)
	if result.Error != nil {
		ContexJsonResponse(c, "Error on orders search", http.StatusInternalServerError, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Orders fetched successfully", 200, orders, nil)
}

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

// Accept order by id
func AcceptOrderByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// Int in params :id
	id := c.Param("id")

	// Get order
	var order models.Order
	models.GORMDB.First(&order, id)

	var input struct {
		Delivery_time int64 `json:"delivery_time"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		ContexJsonResponse(c, "Error on data parse.", http.StatusBadRequest, nil, err)
		return
	}

	order.Accepted = true
	order.Delivery_time = int32(input.Delivery_time)

	if order.ID == 0 {
		ContexJsonResponse(c, "Order acceptance  failed, no such an ID available", 500, nil, nil)
		return
	}
	result := models.GORMDB.Save(&order)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product update", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Order accepted successfully", 200, order, nil)
	return
}

// Cancel order by id
func CancelOrderByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// Int in params :id
	id := c.Param("id")

	// Get order
	var order models.Order
	models.GORMDB.First(&order, id)

	order.Accepted = false
	order.Canceled = true
	order.Completed = true

	if order.ID == 0 {
		ContexJsonResponse(c, "Order cancelation  failed, no such an ID available", 500, nil, nil)
		return
	}
	result := models.GORMDB.Save(&order)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product update", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Order canceled successfully", 200, order, nil)
	return
}

// Complete order by id
func CompleteOrderByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}

	// Int in params :id
	id := c.Param("id")

	// Get order
	var order models.Order
	models.GORMDB.First(&order, id)

	order.Completed = true

	if order.ID == 0 {
		ContexJsonResponse(c, "Order completition  failed, no such an ID available", 500, nil, nil)
		return
	}
	result := models.GORMDB.Save(&order)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on product update", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Order completed successfully", 200, order, nil)
	return

}

// Get today orders
func GetTodayOrdersHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()
	var orders []models.Order

	year, month, day := time.Now().Date()

	today := fmt.Sprint(year, "-", month, "-", day)
	fmt.Println(today)
	result := models.GORMDB.Where(" DATE(created_at) = ?", today).Find(&orders)
	if result.Error != nil {
		ContexJsonResponse(c, "Error on orders search", http.StatusInternalServerError, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Orders fetched successfully", 200, orders, nil)
}
