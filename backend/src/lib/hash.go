package lib

import (
	"fmt"

	"github.com/speps/go-hashids/v2"
)

func GetHashedID(id uint) (string, error) {
	hash_numbers := []int{492, 123, int(id), 23}

	hd := hashids.NewData()
	hd.Salt = GoDotEnvVariable("HASH_ID_SALT")
	hd.Alphabet = "ABCDEFGHIJKLMNOPQRSTXYZW123456789abcdefghijklmnopqrstxyzw"
	hd.MinLength = 30
	h, _ := hashids.NewWithData(hd)
	hashed_id, err := h.Encode(hash_numbers)

	return hashed_id, err
}

func GetIdFromHash(id string) (uint, error) {
	hd := hashids.NewData()
	hd.Salt = GoDotEnvVariable("HASH_ID_SALT")
	hd.Alphabet = "ABCDEFGHIJKLMNOPQRSTXYZW123456789abcdefghijklmnopqrstxyzw"
	hd.MinLength = 30
	h, _ := hashids.NewWithData(hd)
	numbers, _ := h.DecodeInt64WithError(id)
	fmt.Println(numbers)
	return 1, nil
	// return uint(numbers[0]), err
}
