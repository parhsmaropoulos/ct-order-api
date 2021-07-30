package handlers

import (
	"github.com/gin-gonic/gin"
)

func ContexJsonResponse(c *gin.Context, message string, code int, data interface{}) {
	c.JSON(code, gin.H{
		"code":    code,
		"message": message,
		"data":    data,
	})
}
