package sse

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	models "main/src/models"

	"github.com/gin-gonic/gin"
)

// A single Broker will be created in this program. It is responsible
// for keeping a list of which clients (browsers) are currently attached
// and broadcasting events (messages) to those clients.
//
type Broker struct {

	// Create a map of clients, the keys of the map are the channels
	// over which we can push messages to attached clients.  (The values
	// are int for id.)
	//
	Clients map[chan string]string

	// Channel into which new clients can be pushed
	//
	NewClients chan chan string

	// Channel into which disconnected clients should be pushed
	//
	DefunctClients chan chan string

	// Channel into which messages are pushed to be broadcast out
	// to attahed clients.
	//
	Messages chan string
}

var id string
var reason string

// This Broker method starts a new goroutine.  It handles
// the addition & removal of clients, as well as the broadcasting
// of messages out to clients that are currently attached.
//
func (b *Broker) Start() {

	// Start a goroutine
	//
	go func() {

		// Loop endlessly
		//
		for {

			// Block until we receive from one of the
			// three following channels.
			select {

			case s := <-b.NewClients:

				// There is a new client attached and we
				// want to start sending them messages.

				b.Clients[s] = id
				log.Println("Added new client")

			case s := <-b.DefunctClients:

				// A client has dettached and we want to
				// stop sending them messages.
				delete(b.Clients, s)
				close(s)

				log.Println("Removed client")

			case msg := <-b.Messages:

				// There is a new order to send.
				// If the global reason is to send an order
				// only admin gets it.
				// else send the response to the client is came from.
				if reason == "SendOrder" {

					for s := range b.Clients {
						client := b.Clients[s]
						if client == "admin" {
							log.Printf("Broadcast message to  clients with id %s", client)
							s <- msg
							break
						}
					}
				} else {
					for s := range b.Clients {
						client := b.Clients[s]
						if client == id {
							log.Printf("Broadcast message to  clients with id %s", client)
							s <- msg
							break
						}
					}
				}
			}
		}
	}()
}

// This Broker method handles and HTTP request at the "/events/" URL.
//
func (b *Broker) ServeHTTP(w http.ResponseWriter, r *http.Request, new_id string) {

	// Make sure that the writer supports flushing.
	//
	f, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported!", http.StatusInternalServerError)
		return
	}

	id = new_id
	// Create a new channel, over which the broker can
	// send this client messages.
	messageChan := make(chan string)

	// Add this client to the map of those that should
	// receive updates
	b.NewClients <- messageChan
	// }

	// Listen to the closing of the http connection via the CloseNotifier
	notify := w.(http.CloseNotifier).CloseNotify()
	go func() {
		<-notify
		// Remove this client from the map of attached clients
		// when `EventHandler` exits.
		b.DefunctClients <- messageChan
		log.Println("HTTP connection just closed.")
	}()

	// Set the headers related to event streaming.
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Transfer-Encoding", "chunked")

	// Don't close the connection, instead loop endlessly.
	for {

		// Read from our messageChan.
		msg, open := <-messageChan

		if !open {
			// If our messageChan was closed, this means that the client has
			// disconnected.
			break
		}

		// Write to the ResponseWriter, `w`.
		fmt.Fprintf(w, "data: %s\n\n", msg)

		// Flush the response.  This is only possible if
		// the repsonse supports streaming.
		f.Flush()
	}

	// Done.
	log.Println("Finished HTTP request at ", r.URL.Path)
}

func SendOrder(b *Broker, c *gin.Context) {
	var id = c.Param("id")

	var input struct {
		ID      string       `json:"id"`
		Order   models.Order `json:"order"`
		Details struct {
			Name       string `json:"name"`
			Surname    string `json:"surname"`
			Address_id int64  `json:"address_id"`
			Phone      int64  `json:"phone"`
			Bell_name  string `json:"bell_name"`
			Floor      string `json:"floor"`
		} `json:"user_details"`
		From string `json:"from"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": err})
		return
	}

	reason = "SendOrder"
	input.From = id
	out, er := json.Marshal(input)
	if er != nil {
		panic(er)
	}
	b.Messages <- string(out)
	// c.JSON(200, gin.H{
	// 	"message": "order send",
	// 	"data":    string(out),
	// })

}

func AcceptOrder(b *Broker, c *gin.Context) {

	reason = "AcceptOrder"
	var input struct {
		ID       string `json:"id"`
		Accepted bool   `json:"accepted"`
		Time     int16  `json:"time"`
		From     string `json:"from"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": err})
		return
	}
	fmt.Println("From :")
	fmt.Println(input.From)

	id = input.From

	out, er := json.Marshal(input)
	if er != nil {
		panic(er)
	}
	b.Messages <- string(out)
	// c.JSON(200, gin.H{
	// 	"message": "order accepted",
	// 	"data":    string(out),
	// })
}
