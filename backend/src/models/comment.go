// Comments and ratings
package models

import (
	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	Text     string `json:"text"`
	Answer   string `json:"answer"`
	Approved bool   `json:"approved"`
	Answered bool   `json:"answered"`
	Rejected bool   `json:"rejected"`
	UserID   uint   `json:"user_id" gorm:"UNIQUE_INDEX:compositeindex"`
	OrderID  uint   `json:"order_id" gorm:"UNIQUE_INDEX:compositeindex"`

	Rate float32 `json:"rate"`
}
