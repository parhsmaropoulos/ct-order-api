package handlers

import (
	"GoProjects/CoffeeTwist/backend/lib"
	"GoProjects/CoffeeTwist/backend/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"reflect"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// Create a new payment
func NewPaymentHandler(c *gin.Context) {
	if c.Request.Method != "POST" {
		fmt.Println("Only post requests here, nothing else!")
		return
	}

	var input struct {
		Token       string `json:"token"`
		Amount      string `json:"amount"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		ContexJsonResponse(c, "Error on data parse.", http.StatusBadRequest, nil, err)
		return
	}

	//Get env api key
	var auth = lib.GoDotEnvVariable("EVERYPAY_PRIVATE_KEY")
	//Create the post form
	form := url.Values{}
	form.Add("token", input.Token)
	form.Add("amount", input.Amount)
	form.Add("description", input.Description)
	req, _ := http.NewRequest("POST", "https://sandbox-api.everypay.gr/payments", strings.NewReader(form.Encode()))
	//Set headers and basic auth for everypay api
	req.SetBasicAuth(auth, "")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	//Make the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		ContexJsonResponse(c, "Error on everypay request", 500, nil, err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		ContexJsonResponse(c, "Error on reading response of everypay request", 500, nil, err)
	}

	var everypay_res struct {
		Token        string `json:"token"`
		Description  string `json:"description"`
		Amount       int64  `json:"amount"`
		Date_Created string `json:"date_created"`
		Error        struct {
			Status  int64  `json:"status"`
			Message string `json:"message"`
		} `json:"error"`
	}

	err = json.Unmarshal([]byte(body), &everypay_res)

	if reflect.ValueOf(everypay_res.Error).IsZero() == false {
		ContexJsonResponse(c, everypay_res.Error.Message, int(everypay_res.Error.Status), nil, nil)
		return
	}

	var payment models.Payment
	payment.Date_Created, err = time.Parse("2006-01-02T15:04:05.000Z", everypay_res.Date_Created)
	if err != nil {
		log.Println("Erorr on date date parse")
	}
	payment.Amount = everypay_res.Amount
	payment.Description = everypay_res.Description
	payment.Token = everypay_res.Token

	result := models.GORMDB.Table("payments").Save(&payment)
	if result.Error != nil {
		ContexJsonResponse(c, "Internal server error on payment creation", http.StatusInternalServerError, nil, result.Error)
		return
	}
	ContexJsonResponse(c, "Payment created successfully", 200, input, nil)

}
