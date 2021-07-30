// User class
package models

import (
	"time"
)

type BaseSubscribe struct {
	Email string `json:"email"`
}

type Subscribe struct {
	ID            int64         `bson:"_id" json:"id"`
	BaseSubscribe BaseSubscribe `json:"base_subscribe"`
	Active        bool          `json:"active"`
}

type BaseAddress struct {
	CityName      string  `json:"city_name"`
	AreaName      string  `json:"area_name"`
	AddressName   string  `json:"address_name"`
	AddressNumber string  `json:"address_number"`
	Zipcode       string  `json:"zipcode"`
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
	UserId        int64   `json:"user_id"`
}

type Address struct {
	// ID          primitive.ObjectID `bson:"_id" json:"id"`
	ID          int64       `bson:"_id" json:"id"`
	BaseAddress BaseAddress `json:"base_address"`
	// CityName      string             `json:"city_name"`
	// AreaName      string             `json:"area_name"`
	// AddressName   string             `json:"address_name"`
	// AddressNumber string             `json:"address_number"`
	// Zipcode       string             `json:"zipcode"`
	// Latitude      float64            `json:"latitude"`
	// Longitude     float64            `json:"longitude"`
}

type BaseUser struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type PersonalInfo struct {
	Name    string `json:"name"`
	Surname string `json:"surname"`
	Phone   int64  `json:"phone"`
}

type OrdersInfo struct {
	// Comments   []Comment `json:"comments"`
	Comments_id []int `json:"comments_ids"`
	// Orders      []Order  `json:"orders"`
	Last_Order Order `json:"last_order"`
	Orders_ids []int `json:"orders_ids"`
}

type User struct {
	// ID primitive.ObjectID `bson:"_id" json:"id"`
	ID int64 `bson:"_id" json:"id"`
	// Base user account info
	// Username string `json:"username"`
	// Password string `json:"password"`
	BaseUser BaseUser `json:"base_user"`

	// User personal info
	// Email   string `json:"email"`
	// Name    string `json:"name"`
	// Surname string `json:"surname"`
	// Phone   string `json:"phone"`
	PersonalInfo PersonalInfo `json:"personal_info"`

	// User's location info
	// Addresses []Address `json:"addresses"`
	Addresses_id []int `json:"addresses_ids"`

	// User's info for the shop
	// Comments []Comment `json:"comments"`
	// Orders     []Order  `json:"orders"`
	// Last_Order Order    `json:"last_order"`
	// Orders_ids []string `json:"orders_ids"`
	// Last Order
	OrdersInfo OrdersInfo `json:"orders_info"`

	// Account info
	Created_at time.Time `json:"created_at"`
	Deleted_at time.Time `json:"deleted_at"`
	Active     bool
	// Last login?
	//
}

// func CreateProfile(c *gin.Context) {
// 	if c.Request.Method != "POST" {
// 		fmt.Println("Only post requests here, nothing else!")
// 		return
// 	}

// 	var input User
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Check if email exist
// 	var usr User
// 	err_usr := Users.FindOne(context.Background(), bson.M{"email": input.Email}).Decode(&usr)
// 	// fmt.Print(err_usr.Error())
// 	if err_usr != mongo.ErrNoDocuments {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Email already exists",
// 		})
// 		return
// 	}

// 	password := input.Password
// 	// fmt.Print(password)
// 	// Encrypt password
// 	bs, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Internal server error on password encryption",
// 		})
// 		return
// 	}
// 	password = string(bs)
// 	user := User{
// 		ID:         primitive.NewObjectID(),
// 		Username:   input.Username,
// 		Password:   password,
// 		Email:      input.Email,
// 		Name:       input.Name,
// 		Surname:    input.Surname,
// 		Phone:      input.Phone,
// 		Addresses:  []Address{},
// 		Created_at: time.Now(),
// 		Orders:     []Order{},
// 		Last_Order: Order{},
// 		Comments:   []Comment{},
// 		// Ratings:      []Rating{},
// 		Orders_ids: []string{},
// 		// Comments_ids: []string{},
// 		// Ratings_ids:  []string{}
// 	}

// 	Users.InsertOne(context.Background(), user)

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "User created successfully",
// 		"data":    user,
// 	})
// 	return
// }

// func GetUsers(c *gin.Context) {
// 	if c.Request.Method != "GET" {
// 		fmt.Println("Only get here man.")
// 		return
// 	}

// 	users := []User{}

// 	cursor, err := Users.Find(context.Background(), bson.D{})
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	if err = cursor.All(context.Background(), &users); err != nil {
// 		log.Fatal(err)
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Users found",
// 		"data":    users,
// 	})
// }

// func SubscribeUser(c *gin.Context) {
// 	if c.Request.Method != "POST" {
// 		fmt.Println("Only post here man.")
// 		return
// 	}

// 	var input struct {
// 		Email string `json:"email"`
// 	}
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		fmt.Println(err)
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	Subscribes.InsertOne(context.Background(), input)

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Subscribed successfully",
// 		"data":    input,
// 	})
// }

// func UnSubscribeUser(c *gin.Context) {
// 	if c.Request.Method != "DELETE" {
// 		fmt.Println("Only delete here man.")
// 		return
// 	}

// 	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
// 	if errs != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Server error!",
// 		})
// 		return
// 	}

// 	Subscribes.DeleteOne(context.Background(), bson.M{"_id": id})

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "UnSubscribed successfully",
// 	})
// }

// func GetSingleUser(c *gin.Context) {
// 	if c.Request.Method != "GET" {
// 		fmt.Println("Only get here no give!")
// 		return
// 	}

// 	var user User

// 	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
// 	if errs != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Server error!",
// 		})
// 		return
// 	}

// 	err := Users.FindOne(context.Background(), bson.M{"_id": id}).Decode(&user)

// 	user.Password = ""
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "User not found!",
// 		})
// 		return
// 	}

// 	c.JSON(200, gin.H{
// 		"message": "User found",
// 		"user":    user,
// 	})
// }

// func DeleteUser(c *gin.Context) {
// 	if c.Request.Method != "DELETE" {
// 		fmt.Println("Only delete here nothing else!")
// 		return
// 	}

// 	var user User

// 	id, errs := primitive.ObjectIDFromHex(c.Param("id"))
// 	if errs != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": "Server error!",
// 		})
// 		return
// 	}

// 	err := Users.FindOneAndDelete(context.Background(), bson.M{"_id": id}).Decode(&user)

// 	if err != nil {
// 		c.JSON(404, gin.H{
// 			"message": "User not found",
// 		})
// 		return
// 	}

// 	c.JSON(200, gin.H{
// 		"message":        "User deleted",
// 		"delete_product": user,
// 	})
// }

// func Login(c *gin.Context) {
// 	if c.Request.Method != "POST" {
// 		fmt.Println("Only post requests here, nothing else!")
// 		return
// 	}

// 	var input struct {
// 		Email    string `json:"email"`
// 		Password string `json:"password"`
// 	}
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	// First check if email exists
// 	var user User
// 	err := Users.FindOne(context.Background(),
// 		bson.M{"email": input.Email}).Decode(&user)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "Email is not valid!",
// 			"error":   err,
// 		})
// 		return
// 	}

// 	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"message": "Password is wrong!",
// 			"error":   err,
// 		})
// 		return
// 	}

// 	// if len(user.Orders_ids) > 0 {
// 	// 	err = Orders.FindOne(context.Background(),
// 	// 		bson.M{"_id": user.Orders_ids[len(user.Orders_ids)-1]}).Decode(&user.Last_Order)
// 	// }

// 	user.Password = ""
// 	user.Orders = nil

// 	// Token
// 	ts, err := CreateToken(user.ID, user)
// 	if err != nil {
// 		c.JSON(http.StatusUnprocessableEntity, err)
// 		return
// 	}
// 	// saveErr := CreateAuth(user.ID, ts)
// 	// if saveErr != nil {
// 	// 	c.JSON(http.StatusUnprocessableEntity, saveErr)
// 	// }
// 	tokens := map[string]string{
// 		"access_token":  ts.AccessToken,
// 		"refresh_token": ts.RefreshToken,
// 	}
// 	c.JSON(http.StatusOK, tokens)
// }

// func Logout(c *gin.Context) {
// 	// au
// 	_, err := ExtractTokenMetadata(c.Request)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, "unauthorized")
// 		return
// 	}
// 	// deleted, delErr := DeleteAuth(au.AccessUuid)
// 	// if delErr != nil || deleted == 0 { //if anything goes wrong
// 	// 	c.JSON(http.StatusUnauthorized, "unauthorized")
// 	// 	return
// 	// }
// 	c.JSON(http.StatusOK, "Successfully logged out")
// }

// func UpdateUser(c *gin.Context) {
// 	if c.Request.Method != "PUT" {
// 		fmt.Println("Only put here man.")
// 		return
// 	}
// 	var input struct {
// 		ID        string  `json:"id"`
// 		User      User    `json:"user"`
// 		Password  string  `json:"password"`
// 		Address   Address `json:"address"`
// 		AddressId string  `json:"address_id"`
// 		Reason    string  `json:"reason"`
// 	}
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": err})
// 		return
// 	}
// 	// newID := primitive.NewObjectID()

// 	// input.Address.ID = newID

// 	user := input.User
// 	// fmt.Println(input.Reason)
// 	// AUTH CHECK
// 	// tokenAuth, err := ExtractTokenMetadata(c.Request)
// 	// if err != nil {
// 	// 	c.JSON(http.StatusUnauthorized, "unauthorized")
// 	// 	return
// 	// }
// 	// _, err = FetchAuth(tokenAuth)
// 	// if err != nil {
// 	// 	c.JSON(http.StatusUnauthorized, "unauthorized")
// 	// 	return
// 	// }
// 	var err error
// 	switch input.Reason {
// 	case "change_password":
// 		err = user.ChangePassword(input.ID, input.Password)
// 	case "update_user":
// 		err = user.UpdateUserValue(input.ID)
// 	case "add_address":
// 		err = user.AddAddress(input.ID, input.Address)
// 	case "remove_address":
// 		err = user.DeleteAddress(input.ID, input.AddressId)
// 	case "update_address":
// 		err = user.UpdateAddress(input.ID, input.AddressId, input.Address)
// 	default:
// 		return
// 	}

// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	user.Password = ""
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "User  updated successfully",
// 		"data":    user,
// 	})
// }

// func (usr User) ChangePassword(id string, pass string) error {
// 	id_hex, errs := primitive.ObjectIDFromHex(id)
// 	if errs != nil {
// 		return errs
// 	}
// 	// fmt.Println("here")
// 	// fmt.Println(pass)

// 	password := ""
// 	// Encrypt password
// 	bs, errs := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.MinCost)
// 	if errs != nil {
// 		return errs
// 	}
// 	password = string(bs)

// 	_, err := Users.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": id_hex},
// 		bson.M{
// 			"$set": bson.M{
// 				"password": password,
// 			},
// 		},
// 		options.Update(),
// 	)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (usr User) UpdateUserValue(id string) error {
// 	id_hex, errs := primitive.ObjectIDFromHex(id)
// 	if errs != nil {
// 		return errs
// 	}

// 	_, err := Users.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": id_hex},
// 		bson.M{"$set": bson.M{
// 			"name":    usr.Name,
// 			"surname": usr.Surname,
// 			"email":   usr.Email,
// 			"phone":   usr.Phone,
// 		}},
// 		options.Update(),
// 	)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (usr User) AddAddress(id string, addr Address) error {
// 	id_hex, errs := primitive.ObjectIDFromHex(id)
// 	if errs != nil {
// 		return errs
// 	}
// 	newID := primitive.NewObjectID()

// 	addr.ID = newID

// 	_, err := Users.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": id_hex},
// 		bson.M{"$push": bson.M{
// 			"addresses": addr,
// 		}},
// 		options.Update(),
// 	)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (usr User) DeleteAddress(id string, addr_id string) error {
// 	id_hex, errs := primitive.ObjectIDFromHex(id)
// 	if errs != nil {
// 		return errs
// 	}
// 	add_id_hex, errs := primitive.ObjectIDFromHex(addr_id)
// 	if errs != nil {
// 		return errs
// 	}
// 	_, err := Users.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": id_hex},
// 		bson.M{"$pull": bson.M{
// 			"addresses": bson.M{
// 				"_id": add_id_hex,
// 			},
// 		}},
// 		options.Update(),
// 	)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (usr User) UpdateAddress(id string, addr_id string, addr Address) error {
// 	id_hex, errs := primitive.ObjectIDFromHex(id)
// 	if errs != nil {
// 		return errs
// 	}
// 	addr_id_hex, errs := primitive.ObjectIDFromHex(addr_id)
// 	if errs != nil {
// 		return errs
// 	}

// 	_, err := Users.UpdateOne(
// 		context.Background(),
// 		bson.M{"_id": id_hex, "addresses._id": addr_id_hex},
// 		bson.M{
// 			"$set": bson.M{
// 				"addresses.$[ele]": bson.M{
// 					"_id":           addr_id_hex,
// 					"cityname":      addr.CityName,
// 					"areaname":      addr.AreaName,
// 					"addressname":   addr.AddressName,
// 					"addressnumber": addr.AddressNumber,
// 					"zipcode":       addr.Zipcode,
// 				},
// 			},
// 		},
// 		options.Update().SetArrayFilters(options.ArrayFilters{
// 			Filters: []interface{}{bson.M{
// 				"ele._id": addr_id_hex,
// 			}},
// 		}),
// 	)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }
