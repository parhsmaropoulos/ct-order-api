package models

import "gorm.io/gorm"

type Product_Category struct {
	gorm.Model
	Name        string `json:"name" gorm:"uniqueIndex"`
	Description string `json:"description"`
	Image       string `json:"image"`
}
