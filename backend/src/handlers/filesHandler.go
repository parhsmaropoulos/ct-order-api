package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
)

func handleFileupload(c *gin.Context) (err error, fileName string) {
	// parse incoming image file

	file, err := c.FormFile("file")

	if err != nil {
		log.Println("image upload error --> ", err)
		ContexJsonResponse(c, "Image parse error",http.StatusInternalServerError,nil,err)
		return err,""
	}

	uniquieId := uuid.NewV4().String();

	filename := strings.Replace(uniquieId,"-","",-1)

	fileExt := strings.Split(file.Filename, ".")[1]

	image := fmt.Sprintf("%s.%s",filename,fileExt)

	err = c.SaveUploadedFile(file, fmt.Sprintf("./assets/img/%s", image))

	if err != nil {
		log.Println("image save error --> ", err)
		ContexJsonResponse(c, "Error save image", http.StatusInternalServerError, nil,err)
		return err,""
	}

	return nil,image

}