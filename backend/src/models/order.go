// Orders
package models

import (
	"bytes"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"math"

	"github.com/johnfercher/maroto/pkg/color"
	"github.com/johnfercher/maroto/pkg/consts"
	"github.com/johnfercher/maroto/pkg/pdf"
	"github.com/johnfercher/maroto/pkg/props"
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

	Name      string `json:"name"`
	Surname   string `json:"surname"`
	Phone     int64  `json:"phone"`
	Bell_name string `json:"bell_name"`
	Floor     string `json:"floor"`
	// Address   Address `json:"address"`

	Client_Area_Name      string  `json:"client_area_name" gorm:""`
	Client_City_Name      string  `json:"client_city_name"`
	Client_Address_Name   string  `json:"client_address_name"`
	Client_Address_Number string  `json:"client_address_number"`
	Client_Zip            string  `json:"client_zip"`
	Client_Lat            float64 `json:"client_lat"`
	Client_Lon            float64 `json:"client_lon"`

	Delivery_time int32   `json:"delivery_time"`
	Comment       Comment `json:"comment"`

	Accepted  bool `json:"accepted"`
	Completed bool `json:"completed"`
	Canceled  bool `json:"canceled"`

	Receipt bytes.Buffer `json:"receipt" gorm:"-"`
}

func Round(num float64) int {
	return int(num + math.Copysign(0.5, num))
}

func ToFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(Round(num*output)) / output
}

func GeneratePDFReciept(order Order) bytes.Buffer {
	// begin := time.Now()

	// darkGrayColor := getDarkGrayColor()
	// grayColor := getGrayColor()
	// whiteColor := color.NewWhite()
	// blueColor := getBlueColor()
	// redColor := getRedColor()
	// header := getHeader()

	m := pdf.NewMaroto(consts.Portrait, consts.A5)
	// m.SetPageMargins(10, 15, 10)
	// HEADER
	m.RegisterHeader(func() {
		m.Row(20, func() {
			m.Col(12, func() {
				m.Text("COFFEE TWIST", props.Text{
					Align:       consts.Left,
					Extrapolate: false,
				})
				m.Text("ΠΡΟΣΟΧΗ ΔΕΝ ΕΙΝΑΙ ΑΠΟΔΕΙΞΗ", props.Text{
					Top:         5,
					Align:       consts.Left,
					Extrapolate: false,
				})
				m.Text("***** ΔΕΛΤΙΟ ΠΑΡΑΓΓΕΛΙΑΣ *****", props.Text{
					Top:         10,
					Align:       consts.Left,
					Extrapolate: false,
				})
				m.Text(fmt.Sprintf("%d-%d-%d  %d-%d-%d  ", order.CreatedAt.Day(), order.CreatedAt.Month(), order.CreatedAt.Year(), order.CreatedAt.Hour(), order.CreatedAt.Minute(), order.CreatedAt.Second()), props.Text{
					Top:         15,
					Align:       consts.Left,
					Extrapolate: false,
				})
				m.Text(fmt.Sprintf("ΑΡΙΘΜΟΣ ΠΑΡΑΓΓΕΛΙΑΣ %d ", order.ID), props.Text{

					Top:         20,
					Align:       consts.Left,
					Extrapolate: false,
				})
			})
		})
	})
	// FOOTER
	m.RegisterFooter(func() {
		m.Row(20, func() {
			m.Col(12, func() {
				m.Text("##### www.coffeetwist.gr #####", props.Text{
					Top:   16,
					Size:  8,
					Align: consts.Center,
				})
			})
		})
	})
	// ORDER TIPS
	m.Row(20, func() {
		if order.Tips > 0.1 {
			m.Col(3, func() {
				m.Text("TIP Διανομέα :", props.Text{
					Top:   16,
					Style: consts.Bold,
					Align: consts.Left,
				})
			})
			m.Col(6, func() {
				m.Text(fmt.Sprintf("%.2f  €", order.Tips), props.Text{
					Top:   16,
					Style: consts.Bold,
					Align: consts.Right,
				})
			})
		}
	})
	// ORDER PRODUCTS
	for i, prod := range order.Products {
		m.Row(10, func() {
			m.Row(6, func() {
				m.Text(fmt.Sprintf("%d x %s", prod.Quantity, prod.Item_Name), props.Text{
					Top:   3,
					Style: consts.Bold,
					Align: consts.Left,
				})
			})
			if len(prod.Option_Answers) > 0 {
				m.Row(10, func() {
					//map answers
					for _, answer := range prod.Option_Answers {
						m.Col(6, func() {
							m.Text(fmt.Sprintf("  +%s", answer), props.Text{
								Top:   3 + float64(i)*3,
								Style: consts.Bold,
								Align: consts.Left,
							})
						})
					}
				})
			}
			if len(prod.Extra_Ingredients) > 0 {
				m.Row(10, func() {
					//map extra ingredients
					for i, extra := range prod.Extra_Ingredients {
						m.Col(6, func() {
							m.Text(fmt.Sprintf("  +%s", extra), props.Text{
								Top:   3 + float64(i)*3,
								Style: consts.Bold,
								Align: consts.Left,
							})
						})
					}
				})
			}
			if prod.Comment != "" {
				m.Row(10, func() {
					//map extra ingredients
					m.Col(6, func() {
						m.Text(fmt.Sprintf(" Σχόλιο +%s", prod.Comment), props.Text{
							Top:   3,
							Style: consts.Bold,
							Align: consts.Left,
						})
					})
				})
			}
			m.Col(3, func() {
				m.Text(fmt.Sprintf("%.2f €", prod.Total_Price), props.Text{
					Top:   5,
					Style: consts.Bold,
					Align: consts.Right,
				})
			})
		})
	}
	// ORDER COMMENTS
	if order.Comments != "" {
		m.Row(20, func() {
			m.Col(2, func() {
				m.Text("Σχόλια:", props.Text{
					Top:   5,
					Style: consts.Bold,
					Size:  8,
					Align: consts.Left,
				})
			})
			m.Col(10, func() {
				m.Text(order.Comments, props.Text{
					Top:   5,
					Style: consts.Bold,
					Size:  8,
					Align: consts.Left,
				})
			})
		})
	}

	// PAYMENT TYPE AND TOTAL
	m.Row(20, func() {
		m.Col(12, func() {
			m.Text("#######################################", props.Text{
				Top:   5,
				Style: consts.Bold,
				Align: consts.Center,
			})
			m.Text(fmt.Sprintf("ΕΞΟΦΛΗΣΗ ΜΕ: %s", order.Payment_Type), props.Text{
				Top:   10,
				Style: consts.Bold,
				Align: consts.Center,
			})
			m.Text("ΣΥΝΟΛΟ:", props.Text{
				Top:   15,
				Style: consts.Bold,
				Align: consts.Center,
			})
			m.Text(fmt.Sprintf("%.2f €", order.After_Discount_Price), props.Text{
				Top:   15,
				Style: consts.Bold,
				Align: consts.Right,
			})
			m.Text("#######################################", props.Text{
				Top:   20,
				Style: consts.Bold,
				Align: consts.Center,
			})
		})
	})
	// USER DETAILS

	m.Row(25, func() {
		m.Col(12, func() {
			m.Text(fmt.Sprintf("ΟΝ/ΜΟ : %s %s", order.Name, order.Surname), props.Text{
				Top:         3,
				Align:       consts.Left,
				Extrapolate: false,
			})
			m.Text(fmt.Sprintf("ΚΙΝΗΤΟ : %d", order.Phone), props.Text{
				Top:         6,
				Align:       consts.Left,
				Extrapolate: false,
			})
			m.Text(fmt.Sprintf("ΠΟΛΗ : %s, %s", order.Client_Area_Name, order.Client_City_Name), props.Text{
				Top:         9,
				Align:       consts.Left,
				Extrapolate: false,
			})
			m.Text(fmt.Sprintf("ΟΔΟΣ : %s %s", order.Client_Address_Name, order.Client_Address_Number), props.Text{
				Top:         12,
				Align:       consts.Left,
				Extrapolate: false,
			})
			m.Text(fmt.Sprintf("ΤΚ : %s", order.Client_Zip), props.Text{
				Top:         15,
				Align:       consts.Left,
				Extrapolate: false,
			})
			m.Text(fmt.Sprintf("ΟΡΟΦΟΣ : %s", order.Floor), props.Text{
				Top:         18,
				Align:       consts.Left,
				Extrapolate: false,
			})
			m.Text(fmt.Sprintf("ΚΟΥΔΟΥΝΙ : %s", order.Bell_name), props.Text{
				Top:         21,
				Align:       consts.Left,
				Extrapolate: false,
			})
		})
	})

	output, err := m.Output()
	// err := m.OutputFileAndClose(fmt.Sprintf("assets/pdfs/order-%d.pdf",order.ID))
	if err != nil {
		fmt.Println("Could not save PDF:", err)
		return bytes.Buffer{}
	}
	return output

	// end := time.Now()
	// fmt.Println(end.Sub(begin))
}

func getHeader() []string {
	return []string{"Quantity", "Name", "Price"}
}

func getDarkGrayColor() color.Color {
	return color.Color{
		Red:   55,
		Green: 55,
		Blue:  55,
	}
}

func getGrayColor() color.Color {
	return color.Color{
		Red:   200,
		Green: 200,
		Blue:  200,
	}
}

func getBlueColor() color.Color {
	return color.Color{
		Red:   10,
		Green: 10,
		Blue:  150,
	}
}

func getRedColor() color.Color {
	return color.Color{
		Red:   150,
		Green: 10,
		Blue:  10,
	}
}
