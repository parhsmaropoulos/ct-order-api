package models

import "time"

type Discount struct {
	Percentage  int       `json:"percentage"`
	Description string    `json:"description"`
	Stack       bool      `json:"stack"`
	Valid       bool      `json:"valid"`
	Started     time.Time `json:"started"`
	Ended       time.Time `json:"ended"`
}
