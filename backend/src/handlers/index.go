package handlers

import (
	"github.com/getsentry/sentry-go"
	"github.com/gin-gonic/gin"
)

func ContexJsonResponse(c *gin.Context, message string, code int, data interface{}, err error) {
	var erro string
	if err != nil {
		sentry.CaptureMessage("ContexJsonResponse error: "+ err.Error())
		// sentry.ExtractStacktrace(err)
		erro = err.Error()
	} else {
		erro = ""
	}
	c.JSON(code, gin.H{
		"code":    code,
		"message": message,
		"data":    data,
		"error":   erro,
	})
}
