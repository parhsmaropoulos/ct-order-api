package handlers

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"log"
	"main/src/lib"
	"mime/multipart"
	"net/http"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/gin-gonic/gin"
	"github.com/nfnt/resize"
	"github.com/twinj/uuid"
)

func handleFileupload(c *gin.Context) (err error, fileName string) {
	sess := c.MustGet("sess").(*session.Session)
	uploader := s3manager.NewUploader(sess)
	myBucket := lib.GoDotEnvVariable("BUCKET_NAME")
	myRegion := lib.GoDotEnvVariable("AWS_REGION")

	env := lib.GoDotEnvVariable("GIN_ENV")

	// parse incoming image file
	file, header, err := c.Request.FormFile("file")

	if err != nil {
		log.Println("image upload error --> ", err)
		ContexJsonResponse(c, "Image parse error", http.StatusInternalServerError, nil, err)
		return err, ""
	}

	uniquieId := uuid.NewV4()
	filename := strings.Replace(uniquieId.String(), "-", "", -1)
	fileExt := strings.Split(header.Filename, ".")[1]
	fullFileName := fmt.Sprintf("%s.%s", filename, fileExt)
	filePath := fmt.Sprintf("./assets/img/%s", fullFileName)

	// Resize file after saving to to temporary file
	out, err := os.Create(filePath)
	if err != nil {
		return err, ""
	}
	defer out.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		log.Println(err)
		return err, ""
	}

	resized := resize.Thumbnail(300, 200, img, resize.NearestNeighbor)

	filepath := ""
	if env == "production" {
		buf := new(bytes.Buffer)
		err = jpeg.Encode(buf, resized, nil)
		if err != nil {
			log.Println(err)
			return err, ""
		}
		send_s3 := buf.Bytes()

		//upload to the s3 bucket
		up, err := uploader.Upload(&s3manager.UploadInput{
			Bucket: aws.String(myBucket),
			ACL:    aws.String("public-read"),
			Key:    aws.String(filename),
			Body:   bytes.NewReader(send_s3),
		})

		if err != nil {
			log.Println("image save error --> ", err)
			ContexJsonResponse(c, "Error save image", http.StatusInternalServerError, up, err)
			return err, ""
		}
		filepath = "https://" + myBucket + "." + "s3-" + myRegion + ".amazonaws.com/" + filename
	} else {
		err = jpeg.Encode(out, resized, nil)
		if err != nil {
			log.Println(err)
			return err, ""
		}
		filepath = fullFileName
	}
	return nil, filepath

}

func SaveAndResizeFile(file multipart.File, dst string) (error, *os.File) {
	out, err := os.Create(dst)
	if err != nil {
		return err, out
	}
	defer out.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		log.Println(err)
		return err, out
	}

	resized := resize.Thumbnail(300, 200, img, resize.NearestNeighbor)

	err = jpeg.Encode(out, resized, nil)
	if err != nil {
		log.Println(err)
		return err, out
	}

	return err, out
}
