// middleware/auth.go
package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"firebase.google.com/go/auth"
	"github.com/gin-gonic/gin"
)

type Context struct {
	gin.Context
	Token *auth.Token
}

// AuthMiddleware : to verify all authorized operations
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		firebaseAuth := c.MustGet("firebaseAuth").(*auth.Client)
		authorizationToken := c.GetHeader("Authorization")
		idToken := strings.TrimSpace(strings.Replace(authorizationToken, "Bearer", "", 1))
		if idToken == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Id token not available"})
			c.Abort()
			return
		}
		//verify token
		token, err := firebaseAuth.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			fmt.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}
		c.Set("UUID", token.UID)
		fmt.Println(token)
		c.Next()
	}
}
