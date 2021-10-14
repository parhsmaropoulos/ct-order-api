package models

import "gorm.io/gorm"

type Ingredient struct {
	gorm.Model
	Hashed_id   string  `json:"hashed_id" gorm:"-"`
	Name        string  `json:"name" gorm:"uniqueIndex"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
	Available   bool    `json:"available"`
}
