// Orders
package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type OrderProduct struct {
	Comment           string         `json:"comment"`
	Price             float64        `json:"price"`
	Extra_Price       float64        `json:"extra_price"`
	Extra_Ingredients pq.StringArray `json:"extra_ingredients" gorm:"type:varchar[]"`
	Item_Name         string         `json:"item_name"`
	Option_Answers    pq.StringArray `json:"option_answers" gorm:"type:varchar[]"`
	// Options []struct {
	// 	Name   string  `json:"name"`
	// 	Choice string  `json:"choice"`
	// 	Price  float64 `json:"price"`
	// } `json:"options" gorm:"json[]"`
	Quantity    int32   `json:"quantity"`
	Total_Price float64 `json:"total_price"`
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

type OrderProducts []OrderProduct

func (c_a OrderProducts) Value() (driver.Value, error) {
	return json.Marshal(c_a)
}

func (c_a *OrderProducts) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(b, &c_a)
}

type Order struct {
	gorm.Model
	Products      OrderProducts `json:"products"`
	User_id       int           `json:"user_id"`
	Delivery_type string        `json:"delivery_type"`

	Pre_Discount_Price   float64 `json:"pre_discount_price"`
	After_Discount_Price float64 `json:"after_discount_price"`
	Payment_Type         string  `json:"payment_type"`
	// Discounts            []Discount `json:"discounts"`
	Discounts_ids pq.Int64Array `json:"discounts_ids" gorm:"type:integer[]"`
	Tips          float64       `json:"tips"`
	Comments      string        `json:"comments"`

	Name       string `json:"name"`
	Surname    string `json:"surname"`
	Address_id int64  `json:"address_id"`
	Phone      int64  `json:"phone"`
	Bell_name  string `json:"bell_name"`
	Floor      string `json:"floor"`

	Delivery_time int32 `json:"delivery_time"`
	Comment_id    int64 `json:"comment_id"`

	Accepted  bool `json:"accepted"`
	Completed bool `json:"completed"`
	Canceled  bool `json:"canceled"`
}
