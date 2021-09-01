package models

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	Date_Created time.Time `json:"date_created"`
	Token        string    `json:"token"`
	Description  string    `json:"description"`
	Amount       int64     `json:"amount"`
}
