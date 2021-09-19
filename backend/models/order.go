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
	Quantity          int32          `json:"quantity"`
	Total_Price       float64        `json:"total_price"`
	// Options []struct {
	// 	Name   string  `json:"name"`
	// 	Choice string  `json:"choice"`
	// 	Price  float64 `json:"price"`
	// } `json:"options" gorm:"json[]"`
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
	UserID        int           `json:"user_id" gorm:"index:usr_indx"`
	FromID        string        `json:"from_id"`
	Delivery_type string        `json:"delivery_type"`

	Pre_Discount_Price   float64    `json:"pre_discount_price"`
	After_Discount_Price float64    `json:"after_discount_price"`
	Payment_Type         string     `json:"payment_type"`
	Discounts            []Discount `json:"discounts" gorm:"-"`
	// Discounts_ids pq.Int64Array `json:"discounts_ids" gorm:"type:integer[]"`
	Tips     float64 `json:"tips"`
	Comments string  `json:"comments"`

	Name      string  `json:"name"`
	Surname   string  `json:"surname"`
	Phone     int64   `json:"phone"`
	Bell_name string  `json:"bell_name"`
	Floor     string  `json:"floor"`
	// Address   Address `json:"address"`
	
	Client_Area_Name string `json:"client_area_name" gorm:""`
	Client_City_Name string `json:"client_city_name"`
	Client_Address_Name string `json:"client_address_name"`
	Client_Address_Number string `json:"client_address_number"`
	Client_Zip string `json:"client_zip"`
	Client_Lat float64 `json:"client_lat"`
	Client_Lon float64 `json:"client_lon"`

	Delivery_time int32   `json:"delivery_time"`
	Comment       Comment `json:"comment"`

	Accepted  bool `json:"accepted"`
	Completed bool `json:"completed"`
	Canceled  bool `json:"canceled"`
}
