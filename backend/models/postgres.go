package models

import (
	"GoProjects/CoffeeTwist/backend/lib"
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var GORMDB *gorm.DB
var SQLDB *sql.DB

func init() {
	fmt.Println("init 1")
	fmt.Print(lib.GoDotEnvVariable("STATE"))
	psqlInfo := fmt.Sprintf("host =%s port=%s user=%s "+
		"password=%s dbname = %s sslmode=disable",
		lib.GoDotEnvVariable("DATABASE_HOST"),
		lib.GoDotEnvVariable("DATABASE_PORT"),
		lib.GoDotEnvVariable("DATABASE_USERNAME"),
		lib.GoDotEnvVariable("DATABASE_PASSWORD"),
		lib.GoDotEnvVariable("DATABASE_DB"),
	)

	SQLDB, err := sql.Open("postgres", psqlInfo)

	GORMDB, err = gorm.Open(postgres.New(postgres.Config{
		Conn: SQLDB,
	}), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}
	fmt.Println("DATABASE CONNECTION ESTABLISHED")

	GORMDB.AutoMigrate(&User{}, &Ingredient{}, &Product{}, &Subscribe{}, &Choice{}, &ChoiceOption{}, &Order{}, &Product_Category{}, &Address{}, &Comment{}, &Payment{})

	fmt.Println("DATABASE MIGRATION COMPLETED")
}

// func InitTest() {
// 	fmt.Println("init 2")

// 	err := godotenv.Load("../.env")
// 	if err != nil {
// 		fmt.Print(err.Error())
// 		log.Fatal("Error loading .env file")
// 	}

// 	psqlInfo := fmt.Sprintf("host =%s port=%s user=%s "+
// 		"password=%s dbname = %s sslmode=disable",
// 		os.Getenv("DATABASE_HOST"),
// 		os.Getenv("DATABASE_PORT"),
// 		os.Getenv("DATABASE_USERNAME"),
// 		os.Getenv("DATABASE_PASSWORD"),
// 		os.Getenv("DATABASE_DB"),
// 	)

// 	SQLDB, err := sql.Open("postgres", psqlInfo)

// 	GORMDB, err = gorm.Open(postgres.New(postgres.Config{
// 		Conn: SQLDB,
// 	}), &gorm.Config{})
// 	if err != nil {
// 		panic("Failed to connect to database")
// 	}
// 	fmt.Println("DATABASE CONNECTION ESTABLISHED")

// 	GORMDB.AutoMigrate(&User{})
// 	GORMDB.AutoMigrate(&Ingredient{})
// 	GORMDB.AutoMigrate(&Product{})
// 	GORMDB.AutoMigrate(&Subscribe{})
// 	GORMDB.AutoMigrate(&Choice{})
// 	GORMDB.AutoMigrate(&ChoiceOption{})
// 	GORMDB.AutoMigrate(&Product_Category{})
// 	fmt.Println("DATABASE MIGRATION COMPLETED")
// 	defer SQLDB.Close()

// 	// return db
// }
