package websocket

import (
	"errors"
	"log"
	"main/src/models"

	"github.com/getsentry/sentry-go"
	"github.com/gorilla/websocket"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
}


type MessageBody struct {
	ID      string       `json:"id"`
	Order   models.Order `json:"order"`
	From string `json:"from"`
	To string `json:"to"`
	Time int8 `json:"time"`
	Accepted bool `json:"accepted"`

}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()
	for {
		var message MessageBody
		err := c.Conn.ReadJSON(&message)
		if !errors.Is(err, nil) {
			log.Printf("error occurred: %v", err)
			sentry.CaptureMessage("ContexJsonResponse error: "+ err.Error())
			delete(c.Pool.Clients, c)
			break
		}

		// Send a message to hub
		c.Pool.Broadcast <- message
	}
}
