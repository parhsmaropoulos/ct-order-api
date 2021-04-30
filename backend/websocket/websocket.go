package websocket

// import "fmt"

// func (pool *Pool) Start() {
// 	for {
// 		select {
// 		case client := <-pool.Register:
// 			pool.Clients[client] = true
// 			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
// 			for client, _ := range pool.Clients {
// 				fmt.Println(client)
// 				client.Conn.WriteJSON(Message{Type: 1, Body: "New User Joined..."})
// 			}
// 			break
// 		case client := <-pool.Unregister:
// 			delete(pool.Clients, client)
// 			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
// 			for client, _ := range pool.Clients {
// 				client.Conn.WriteJSON(Message{Type: 1, Body: "User Disconnected..."})
// 			}
// 			break
// 		case message := <-pool.Broadcast:
// 			fmt.Println("Sending message to all clients in Pool")
// 			for client, _ := range pool.Clients {
// 				if err := client.Conn.WriteJSON(message); err != nil {
// 					fmt.Println(err)
// 					return
// 				}
// 			}
// 		}
// 	}
// }
