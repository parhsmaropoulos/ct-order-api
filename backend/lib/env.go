package lib

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func GoDotEnvVariable(key string) string {
	//load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading env file")
	}
	return os.Getenv(key)
}
