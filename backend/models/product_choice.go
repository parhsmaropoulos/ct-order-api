package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"gorm.io/gorm"
)

type ChoiceOption struct {
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

type ChoiceArray []ChoiceOption

func (c ChoiceOption) Value() (driver.Value, error) {
	return json.Marshal(c)
}

func (c *ChoiceOption) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(b, &c)
}

func (c_A ChoiceArray) Value() (driver.Value, error) {
	val, err := json.Marshal(c_A)
	return string(val), err
}

func (c_A *ChoiceArray) Scan(value interface{}) error {
	return json.Unmarshal(value.([]byte), &c_A)
}

type Choice struct {
	gorm.Model
	Required    bool        `json:"required"`
	Multiple    bool        `json:"multiple"`
	Name        string      `json:"name" gorm:"uniqueIndex"`
	Description string      `json:"description"`
	Options     ChoiceArray `json:"options" gorm:"column:options;type:longtext"`
}
