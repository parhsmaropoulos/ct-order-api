package handlers

import (
	models "GoProjects/CoffeeTwist/backend/models"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Register a new product choice
func RegisterCommentHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	// JSON input from query
	// text: ""
	// answer: ""
	// approved: bool
	// answered: bool
	// user_id: int
	// order_id: int
	// rate: float
	// created_at: time

	var input models.BaseComment
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	sqlStatement := `INSERT INTO comments (text,answer,approved, answered, user_id, order_id, rate,created_at) values($1,$2,$3,$4,$5,$6,$7,NOW());`
	_, err := models.DB.Exec(sqlStatement, input.Text, input.Answer, input.Approved, input.Answered, input.User_id, input.Order_id, input.Rate, input.Created_at) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on registration",
			"err":     err,
		})
		fmt.Print(err)
		panic(err)
	}
	comment := models.Comment{}
	comment.BaseComment = input
	c.JSON(http.StatusOK, gin.H{
		"message": "Comment created successfully",
		"data":    comment,
	})
	// defer db.Close()
	return
}

// Get all comments
func GetAllCommentsHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	rows, err := models.DB.Query(`select * from comments;`)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Print(rows)
	var comments []models.Comment
	var comment models.Comment
	defer rows.Close()
	for rows.Next() {
		var tmp struct {
			text       string
			answer     string
			approved   bool
			user_id    int64
			order_id   int64
			created_at time.Time
			rate       float64
			answered   bool
			id         int64
		}

		rows.Scan(&tmp.text, &tmp.answer, &tmp.approved, &tmp.user_id, &tmp.order_id, &tmp.created_at, &tmp.rate, &tmp.answer, &tmp.id)

		comment.ID = tmp.id
		comment.BaseComment.Text = tmp.text
		comment.BaseComment.Approved = tmp.approved
		comment.BaseComment.Answer = tmp.answer
		comment.BaseComment.Order_id = tmp.order_id
		comment.BaseComment.Created_at = tmp.created_at
		comment.BaseComment.Answered = tmp.answered
		comment.BaseComment.Rate = float32(tmp.rate)

		comments = append(comments, comment)
	}

	// usersBytes, _ := json.MarshalIndent(users, "", "\t")

	c.JSON(http.StatusOK, gin.H{
		"message": "Comments fetched successfully",
		"data":    comments,
	})

	// defer db.Close()
}

// Get single comment by id
func GetSingleCommentByIdHandler(c *gin.Context) {
	if c.Request.Method != "GET" {
		fmt.Println("Only get requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")

	rows, err := models.DB.Query(`select * from comments where id=$1;`, id)
	if err != nil {
		log.Fatal(err)
	}
	var comment models.Comment
	defer rows.Close()
	for rows.Next() {
		var tmp struct {
			text       string
			answer     string
			approved   bool
			user_id    int64
			order_id   int64
			created_at time.Time
			rate       float64
			answered   bool
			id         int64
		}

		rows.Scan(&tmp.text, &tmp.answer, &tmp.approved, &tmp.user_id, &tmp.order_id, &tmp.created_at, &tmp.rate, &tmp.answer, &tmp.id)

		comment.ID = tmp.id
		comment.BaseComment.Text = tmp.text
		comment.BaseComment.Approved = tmp.approved
		comment.BaseComment.Answer = tmp.answer
		comment.BaseComment.Order_id = tmp.order_id
		comment.BaseComment.Created_at = tmp.created_at
		comment.BaseComment.Answered = tmp.answered
		comment.BaseComment.Rate = float32(tmp.rate)

	}

	// usersBytes, _ := json.MarshalIndent(users, "", "\t")

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment fetched successfully",
		"data":    comment,
	})

	// defer db.Close()
}

// Approve comment by id
func ApproveCommentByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")

	sqlStatement := `UPDATE  comments set approved=$1 where id = $2;`
	_, err := models.DB.Exec(sqlStatement, true, id) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on registration",
			"err":     err,
		})
		fmt.Print(err)
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment approved successfully",
	})
	// defer db.Close()
	return
}

// Reject comment by id
func RejectCommentByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")

	sqlStatement := `UPDATE  comments set approved=$1,answered=$2 where id = $3;`
	_, err := models.DB.Exec(sqlStatement, false, true, id) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on registration",
			"err":     err,
		})
		fmt.Print(err)
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment rejected successfully",
	})
	// defer db.Close()
	return
}

// Answer comment by id
func AnswerCommentByIdHandler(c *gin.Context) {
	if c.Request.Method != "PUT" {
		fmt.Println("Only put requests here, nothing else!")
		return
	}
	// db := models.OpenConnection()

	id := c.Param("id")

	// JSON input
	// answer: ""
	var input struct {
		Answer string `json:"answer"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	sqlStatement := `UPDATE  comments set approved=$1,answered=$2,answer=$3 where id = $4;`
	_, err := models.DB.Exec(sqlStatement, true, true, input.Answer, id) //,,,,
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error on registration",
			"err":     err,
		})
		fmt.Print(err)
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment answered successfully",
	})
	// defer db.Close()
	return
}
