package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"gorm.io/gorm"
)

type ChoiceOption struct {
	gorm.Model
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	ChoiceID uint    `json:"choice_id"`
}

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

type Choice struct {
	gorm.Model
	Required    bool           `json:"required"`
	Multiple    bool           `json:"multiple"`
	Name        string         `json:"name" gorm:"uniqueIndex"`
	Description string         `json:"description"`
	Options     []ChoiceOption `json:"options"`
}
