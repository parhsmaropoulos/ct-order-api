// User class
package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"gorm.io/gorm"
)

type Subscribe struct {
	gorm.Model
	Email  string `json:"email" gorm:"uniqueIndex"`
	Active bool   `json:"active"`
}

type Address struct {
	gorm.Model
	CityName      string  `json:"city_name" gorm:"UNIQUE_INDEX:compositeindex"`
	AreaName      string  `json:"area_name" gorm:"UNIQUE_INDEX:compositeindex"`
	AddressName   string  `json:"address_name" gorm:"UNIQUE_INDEX:compositeindex"`
	AddressNumber string  `json:"address_number" gorm:"UNIQUE_INDEX:compositeindex"`
	Zipcode       string  `json:"zipcode" gorm:"UNIQUE_INDEX:compositeindex"`
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
	UserID        int64   `json:"user_id"`
}

func (c Address) Value() (driver.Value, error) {
	return json.Marshal(c)
}

func (c *Address) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(b, &c)
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
	Addresses []Address `json:"addresses"`
	// Addresses_id pq.Int64Array `json:"addresses_ids" gorm:"type:integer[]"`

	// User's info for the shop
	// Comments_id pq.Int64Array `json:"comments_ids" gorm:"type:integer[]"`
	Comments   []Comment `json:"comments"`
	Last_Order Order     `json:"last_order" gorm:"-"`
	// Orders_ids pq.Int64Array `json:"orders_ids" gorm:"type:integer[]"`
	Orders []Order `json:"orders"`
}
