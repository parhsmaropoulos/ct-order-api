package models

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func HomePage(c *gin.Context) {

	orders := []Order{}

	cursor, err := Orders.Find(context.Background(), bson.M{
		"accepted": false,
	})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.Background(), &orders); err != nil {
		log.Fatal(err)
	}

	c.HTML(http.StatusOK, "index.html", orders)
}
