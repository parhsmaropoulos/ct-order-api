// Product core class and all extenders
package models

import (
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name           string        `json:"name" gorm:"uniqueIndex"`
	Description    string        `json:"description"`
	Price          float64       `json:"price"`
	Image          string        `json:"image"`
	Choices_id     pq.Int64Array `json:"choices_id" gorm:"type:integer[]"`
	Choices        []Choice      `json:"choices" gorm:"many2many:product_choices"`
	Custom         bool          `json:"custom"`
	Category_id    int64         `json:"category_id"`
	Ingredients_id pq.Int64Array `json:"ingredients_id" gorm:"type:integer[]"`
	Ingredients    []Ingredient  `json:"ingredients" gorm:"many2many:product_ingredients"`

	Default_Ingredients pq.StringArray `json:"default_ingredients" gorm:"type:varchar[]"`
	Available           bool           `json:"available"`
	Visible             bool           `json:"visible"`
}
