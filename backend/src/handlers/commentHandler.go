package handlers

import (
	"fmt"
	models "main/src/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// // Register a new comment
func RegisterCommentHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}

	// JSON input from query
	// text: ""
	// user_id: int
	// order_id: int
	// rate: float

	var input struct {
		Text     string  `json:"text"`
		User_id  uint    `json:"user_id"`
		Order_id uint    `json:"order_id"`
		Rate     float32 `json:"rate"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		ContexJsonResponse(c, "Error on data parse.", http.StatusBadRequest, nil, err)
		return
	}

	comment := models.Comment{}
	comment.Text = input.Text

	comment.UserID = input.User_id
	comment.OrderID = input.Order_id
	comment.Rate = input.Rate
	comment.Approved = false
	comment.Answered = false

	result := models.GORMDB.Create(&comment)

	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on comment creation", http.StatusInternalServerError, nil, result.Error)
		return
	}
	ContexJsonResponse(c, "Comment created successfully", 200, comment, nil)
}

// Get all comments
func GetAllCommentsHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	var comments []models.Comment

	result := models.GORMDB.Find(&comments)
	if result.Error != nil {
		ContexJsonResponse(c, "Error on comments search", http.StatusInternalServerError, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Comments fetched successfully", http.StatusOK, comments, nil)
}

// Get all comments of a user
func GetUserCommentsByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	id := c.Param("id")

	var comments []models.Comment

	result := models.GORMDB.Where("user_id =?", id).Find(&comments)
	if result.Error != nil {
		ContexJsonResponse(c, "Error on comments search", http.StatusInternalServerError, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Comments fetched successfully", http.StatusOK, comments, nil)
}

// Get single comment by id
func GetSingleCommentByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}

	id := c.Param("id")

	var comment models.Comment

	result := models.GORMDB.Table("comments").First(&comment, id)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on comment fetch", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Comment fetched successfully", 200, comment, nil)
	return

}

// Approve comment by id
func ApproveCommentByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	id := c.Param("id")

	var comment models.Comment

	result := models.GORMDB.Table("comments").First(&comment, id)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on comment fetch", 500, nil, result.Error)
		return
	}

	comment.Rejected = false
	comment.Approved = true

	result = models.GORMDB.Save(&comment)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on comment save", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Comment updated successfully", 200, comment, nil)
	return
}

// Reject comment by id
func RejectCommentByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	id := c.Param("id")

	var comment models.Comment

	result := models.GORMDB.Table("comments").First(&comment, id)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on comment fetch", 500, nil, result.Error)
		return
	}

	comment.Rejected = true
	comment.Approved = false

	result = models.GORMDB.Save(&comment)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on comment save", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Comment updated successfully", 200, comment, nil)
	return
}

// Answer comment by id
func AnswerCommentByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}

	id := c.Param("id")
	var comment models.Comment

	// JSON input
	// answer: ""
	var input struct {
		Answer string `json:"answer"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := models.GORMDB.Table("comments").First(&comment, id)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on comment fetch", 500, nil, result.Error)
		return
	}

	comment.Answered = true
	comment.Answer = input.Answer

	result = models.GORMDB.Save(&comment)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on comment save", 500, nil, result.Error)
		return
	}

	ContexJsonResponse(c, "Comment updated successfully", 200, comment, nil)
	return

}
