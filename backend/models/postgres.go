package models

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var GORMDB *gorm.DB
var SQLDB *sql.DB

func Init() {
	err := godotenv.Load()
	if err != nil {
		fmt.Print(err.Error())
		log.Fatal("Error loading .env file")
	}

	psqlInfo := fmt.Sprintf("host =%s port=%s user=%s "+
		"password=%s dbname = %s sslmode=disable",
		os.Getenv("DATABASE_HOST"),
		os.Getenv("DATABASE_PORT"),
		os.Getenv("DATABASE_USERNAME"),
		os.Getenv("DATABASE_PASSWORD"),
		os.Getenv("DATABASE_DB"),
	)

	SQLDB, err := sql.Open("postgres", psqlInfo)

	GORMDB, err = gorm.Open(postgres.New(postgres.Config{
		Conn: SQLDB,
	}), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}
	fmt.Println("DATABASE CONNECTION ESTABLISHED")

	GORMDB.AutoMigrate(&User{})
	GORMDB.AutoMigrate(&Ingredient{})
	GORMDB.AutoMigrate(&Product{})
	GORMDB.AutoMigrate(&Subscribe{})
	GORMDB.AutoMigrate(&Choice{})
	fmt.Println("DATABASE MIGRATION COMPLETED")

	// return db
}

func InitTest() {
	err := godotenv.Load("../.env")
	if err != nil {
		fmt.Print(err.Error())
		log.Fatal("Error loading .env file")
	}

	psqlInfo := fmt.Sprintf("host =%s port=%s user=%s "+
		"password=%s dbname = %s sslmode=disable",
		os.Getenv("DATABASE_HOST"),
		os.Getenv("DATABASE_PORT"),
		os.Getenv("DATABASE_USERNAME"),
		os.Getenv("DATABASE_PASSWORD"),
		os.Getenv("DATABASE_DB"),
	)

	SQLDB, err := sql.Open("postgres", psqlInfo)

	GORMDB, err = gorm.Open(postgres.New(postgres.Config{
		Conn: SQLDB,
	}), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}
	fmt.Println("DATABASE CONNECTION ESTABLISHED")

	GORMDB.AutoMigrate(&User{})
	GORMDB.AutoMigrate(&Ingredient{})
	GORMDB.AutoMigrate(&Product{})
	GORMDB.AutoMigrate(&Subscribe{})
	GORMDB.AutoMigrate(&Choice{})
	fmt.Println("DATABASE MIGRATION COMPLETED")
	// return db
}
