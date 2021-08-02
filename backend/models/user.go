// User class
package models

import (
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Subscribe struct {
	gorm.Model
	Email  string `json:"email" gorm:"uniqueIndex"`
	Active bool   `json:"active"`
}

type Address struct {
	gorm.Model
	CityName      string  `json:"city_name"`
	AreaName      string  `json:"area_name"`
	AddressName   string  `json:"address_name"`
	AddressNumber string  `json:"address_number"`
	Zipcode       string  `json:"zipcode"`
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
	UserId        int64   `json:"user_id"`
}

type User struct {
	gorm.Model
	// Base user account info
	Username string `json:"username" binding:"required" `
	Password string `json:"password" binding:"required" `
	Email    string `json:"email" binding:"required" gorm:"uniqueIndex"`

	// User personal info
	Name    string `json:"name" `
	Surname string `json:"surname"`
	Phone   int64  `json:"phone"`

	// User's location info
	// Addresses []Address `json:"addresses"`
	Addresses_id pq.Int64Array `json:"addresses_ids" gorm:"type:integer[]"`

	// User's info for the shop
	Comments_id pq.Int64Array `json:"comments_ids" gorm:"type:integer[]"`
	Last_Order  Order         `json:"last_order" gorm:"-"`
	Orders_ids  pq.Int64Array `json:"orders_ids" gorm:"type:integer[]"`

	// Account info
	// Active bool
	// Last login?
	//
}
