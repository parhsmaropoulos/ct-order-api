package models

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

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

	DB, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer DB.Close()
	err = DB.Ping()
	if err != nil {
		panic(err)
	}

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

	DB, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer DB.Close()

	err = DB.Ping()
	if err != nil {
		panic(err)
	}

	// return db
}
