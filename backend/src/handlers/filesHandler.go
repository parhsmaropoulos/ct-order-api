package handlers

import (
	"fmt"
	"image"
	"image/jpeg"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nfnt/resize"
	"github.com/twinj/uuid"
)

func handleFileupload(c *gin.Context) (err error, fileName string) {
	// parse incoming image file

	file,header, err := c.Request.FormFile("file")

	if err != nil {
		log.Println("image upload error --> ", err)
		ContexJsonResponse(c, "Image parse error",http.StatusInternalServerError,nil,err)
		return err,""
	}

	uniquieId := uuid.NewV4().String();

	filename := strings.Replace(uniquieId,"-","",-1)

	fileExt := strings.Split(header.Filename, ".")[1]

	image := fmt.Sprintf("%s.%s",filename,fileExt)

	err = SaveAndResizeFile(file, fmt.Sprintf("./assets/img/%s", image))

	if err != nil {
		log.Println("image save error --> ", err)
		ContexJsonResponse(c, "Error save image", http.StatusInternalServerError, nil,err)
		return err,""
	}

	return nil,image

}

func SaveAndResizeFile(file multipart.File, dst string) error {
	img, _, err := image.Decode(file)
	if err != nil {
		log.Println(err)
		return err
	}

	resized := resize.Thumbnail(300, 200, img, resize.NearestNeighbor)


	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	err = jpeg.Encode(out, resized, nil)
	if err != nil {
		log.Println(err)
		return err
	}
	return err

}