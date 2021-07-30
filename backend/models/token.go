package models

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/shaj13/go-guardian/auth"
	"github.com/shaj13/go-guardian/store"
	"github.com/twinj/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TokenDetails struct {
	AccessToken  string
	RefreshToken string
	AccessUuid   string
	RefreshUuid  string
	AtExpires    int64
	RtExpires    int64
}

var authenticator auth.Authenticator
var cache store.Cache

// With mongo object id
// func CreateToken(userid primitive.ObjectID, user User)
func CreateToken(userid int64, user User) (*TokenDetails, error) {
	td := &TokenDetails{}
	td.AtExpires = time.Now().Add(time.Minute * 15).Unix()
	td.AccessUuid = uuid.NewV4().String()

	td.RtExpires = time.Now().Add(time.Hour * 24 * 7).Unix()
	td.RefreshUuid = uuid.NewV4().String()

	var err error
	//Creating Access Token
	os.Setenv("ACCESS_SECRET", "jdnfksdmfksd") //this should be in an env file
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["access_uuid"] = td.AccessUuid
	// atClaims["user_id"] = userid
	atClaims["exp"] = td.AtExpires
	atClaims["user"] = user
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return nil, err
	}
	//Creating Refresh Token
	os.Setenv("REFRESH_SECRET", "mcmvmkmsdnfsdmfdsjf") //this should be in an env file
	rtClaims := jwt.MapClaims{}
	rtClaims["refresh_uuid"] = td.RefreshUuid
	rtClaims["user_id"] = userid
	rtClaims["exp"] = td.RtExpires
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	td.RefreshToken, err = rt.SignedString([]byte(os.Getenv("REFRESH_SECRET")))
	if err != nil {
		return nil, err
	}
	return td, nil
}

// func CreateAuth(userid primitive.ObjectID, td *TokenDetails) error {
// 	at := time.Unix(td.AtExpires, 0) //converting Unix to UTC(to Time object)
// 	rt := time.Unix(td.RtExpires, 0)
// 	now := time.Now()

// 	enc_id := userid.Hex()

// 	errAccess := Redis_client.Set(td.AccessUuid, enc_id, at.Sub(now)).Err()
// 	if errAccess != nil {
// 		return errAccess
// 	}
// 	errRefresh := Redis_client.Set(td.RefreshUuid, enc_id, rt.Sub(now)).Err()
// 	if errRefresh != nil {
// 		return errRefresh
// 	}
// 	return nil
// }

func ExtractToken(r *http.Request) string {
	bearToken := r.Header.Get("Authorization")
	//normally Authorization the_token_xxx
	strArr := strings.Split(bearToken, " ")
	fmt.Print(len(strArr))
	if len(strArr) == 2 {
		return strArr[1]
	}
	return ""
}

func VerifyToken(r *http.Request) (*jwt.Token, error) {
	tokenString := ExtractToken(r)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

func TokenValid(r *http.Request) error {
	token, err := VerifyToken(r)
	if err != nil {
		return err
	}
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		return err
	}
	return nil
}

// FOR redis TODO fix bugs
type AccessDetails struct {
	AccessUuid string
	UserId     int64
}

func ExtractTokenMetadata(r *http.Request) (*AccessDetails, error) {
	token, err := VerifyToken(r)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	// fmt.Println("CLAIMS AND OK")
	// fmt.Println(claims, ok)
	if ok && token.Valid {

		accessUuid, ok := claims["access_uuid"].(string)
		// fmt.Println("ACCESS AND OK")
		// fmt.Println(accessUuid, ok)
		if !ok {
			return nil, err
		}
		// userId, err := strconv.ParseInt(fmt.Sprintf("%.f", claims["usid"]), 10, 64)
		userId, err := strconv.ParseInt(fmt.Sprintf("%s", claims["user"].(map[string]interface{})["id"]), 10, 64)
		// userId := fmt.Sprintf("%s", claims["user"].(map[int64]interface{})["id"])
		// fmt.Println("USERID AND ERR")
		// fmt.Println(userId, err)
		if err != nil {
			return nil, err
		}
		return &AccessDetails{
			AccessUuid: accessUuid,
			UserId:     userId,
		}, nil
	}
	return nil, err
}

// func FetchAuth(authD *AccessDetails) (uint64, error) {
// 	userid, err := Redis_client.Get(authD.AccessUuid).Result()
// 	if err != nil {
// 		return 0, err
// 	}
// 	userID, _ := strconv.ParseUint(userid, 10, 64)
// 	return userID, nil
// }

// func DeleteAuth(givenId string) (int64, error) {
// 	deleted, err := Redis_client.Del(givenId).Result()
// 	if err != nil {
// 		return 0, err
// 	}
// 	return deleted, nil
// }

func TokenAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := TokenValid(c.Request)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			c.Abort()
			return
		}
		c.Next()
	}
}

func Refresh(c *gin.Context) {
	// mapToken := map[string]string{}
	var RToken struct {
		Refresh_Token string `json:"refresh_token"`
	}
	if err := c.ShouldBindJSON(&RToken); err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	refreshToken := RToken.Refresh_Token
	fmt.Print(refreshToken)
	//verify the token
	os.Setenv("REFRESH_SECRET", "mcmvmkmsdnfsdmfdsjf") //this should be in an env file
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("REFRESH_SECRET")), nil
	})
	//if there is an error, the token must have expired
	if err != nil {
		c.JSON(http.StatusUnauthorized, "Refresh token expired")
		return
	}
	//is token valid?
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	//Since token is valid, get the uuid:
	claims, ok := token.Claims.(jwt.MapClaims) //the token claims should conform to MapClaims
	if ok && token.Valid {
		// refreshUuid
		_, ok := claims["refresh_uuid"].(string) //convert the interface to string
		if !ok {
			c.JSON(http.StatusUnprocessableEntity, err)
			return
		}
		// userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
		userId, err := primitive.ObjectIDFromHex(fmt.Sprintf("%s", claims["user_id"]))
		if err != nil {
			c.JSON(http.StatusUnprocessableEntity, "Error occurred")
			return
		}
		// //Delete the previous Refresh Token
		// deleted, delErr := DeleteAuth(refreshUuid)
		// if delErr != nil || deleted == 0 { //if any goes wrong
		// 	c.JSON(http.StatusUnauthorized, "unauthorized")
		// 	return
		// }
		// Get the user object
		var user User
		Users.FindOne(context.Background(), bson.M{"_id": userId}).Decode(&user)
		//Create new pairs of refresh and access tokens
		// ts, createErr := CreateToken(user.ID, user) for mongo its objectid
		ts, createErr := CreateToken(1, user)
		if createErr != nil {
			c.JSON(http.StatusForbidden, createErr.Error())
			return
		}
		// //save the tokens metadata to redis
		// saveErr := CreateAuth(userId, ts)
		// if saveErr != nil {
		// 	c.JSON(http.StatusForbidden, saveErr.Error())
		// 	return
		// }
		tokens := map[string]string{
			"access_token":  ts.AccessToken,
			"refresh_token": ts.RefreshToken,
		}
		c.JSON(http.StatusCreated, tokens)
	} else {
		c.JSON(http.StatusUnauthorized, "refresh expired")
	}
}

// ******************************** GO GUARDIAN AUTH ***************************************** //
// func setupGoGuardian() {
// 	authenticator = auth.New()
// 	cache = store.NewFIFO(context.Background(), time.Minute*10)

// 	basicStrategy := basic.New(validateUser, cache)
// 	tokenStrategy := bearer.New(verifyToken, cache)

// 	authenticator.EnableStrategy(basic.StrategyKey, basicStrategy)
// 	authenticator.EnableStrategy(bearer.CachedStrategyKey, tokenStrategy)
// }

// func validateUser(ctx context.Context, r *http.Request, userName, password string) (auth.Info, error) {
// 	// here connect to db or any other service to fetch user and validate it.
// 	if userName == "medium" && password == "medium" {
// 		return auth.NewDefaultUser("medium", "1", nil, nil), nil
// 	}

// 	return nil, fmt.Errorf("Invalid credentials")
// }

// func middleware(next http.Handler) http.HandlerFunc {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		log.Println("Executing Auth Middleware")
// 		user, err := authenticator.Authenticate(r)
// 		if err != nil {
// 			code := http.StatusUnauthorized
// 			http.Error(w, http.StatusText(code), code)
// 			return
// 		}
// 		log.Printf("User %s Authenticated\n", user.UserName())
// 		next.ServeHTTP(w, r)
// 	})
// }

// func verifyToken(ctx context.Context, r *http.Request, tokenString string) (auth.Info, error) {
// 	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
// 		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
// 			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
// 		}
// 		return []byte("secret"), nil
// 	})

// 	if err != nil {
// 		return nil, err
// 	}

// 	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
// 		user := auth.NewDefaultUser(claims["sub"].(string), "", nil, nil)
// 		return user, nil
// 	}

// 	return nil, fmt.Errorf("Invaled token")
// }
