package models

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Users is the pointer to the db collection of type user.
var Users *mongo.Collection

// Orders is the pointer to the db collection of type order.
var Orders *mongo.Collection

// Comments is the pointer to the db collection of type comment.
var Comments *mongo.Collection

// Ratings is the pointer to the db collection of type rating.
var Ratings *mongo.Collection

// Discounts is the pointer to the db collection of type discount.
var Discounts *mongo.Collection

// Products is the pointer to the db collection of type product.
var Products *mongo.Collection

// Product_Categories is the pointer to the db collection of type Product_Category.
var Products_Categories *mongo.Collection

// Choices is the pointer to the db collection of type choice.
var Choices *mongo.Collection

// Ingredients is the pointer to the db collection of type ingredient.
var Ingredients *mongo.Collection

// Initialize the db connection
func Init() {
	// Start a mongo db session
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	Client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	Users = Client.Database("CoffeeTwist").Collection("Users")

	Orders = Client.Database("CoffeeTwist").Collection("Orders")
	Comments = Client.Database("CoffeeTwist").Collection("Comments")
	Ratings = Client.Database("CoffeeTwist").Collection("Ratings")

	Discounts = Client.Database("CoffeeTwist").Collection("Discounts")

	Products = Client.Database("CoffeeTwist").Collection("Products")
	Choices = Client.Database("CoffeeTwist").Collection("Choices")
	Ingredients = Client.Database("CoffeeTwist").Collection("Ingredients")
	Products_Categories = Client.Database("CoffeeTwist").Collection("Product_Category")
}
