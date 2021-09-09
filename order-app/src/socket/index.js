// const url = "ws://localhost:8080/socket/ws";
// const socket = new WebSocket(url);

// let connect = (cb) => {
//   console.log("connecting");

//   socket.onopen = () => {
//     console.log("Successfully Connected");
//   };

//   socket.onmessage = (msg) => {
//     console.log(msg);
//     console.log(cb);
//     cb(msg);
//   };

//   socket.onclose = (event) => {
//     console.log("Socket Closed Connection: ", event);
//   };

//   socket.onerror = (error) => {
//     console.log("Socket Error: ", error);
//   };
// };

// let sendMsg = (msg) => {
//   console.log("sending msg: ", msg);
//   socket.send(msg);
// };

// let sendOrder = (order) => {
//   console.log("sending order: ", order);
//   socket.send(JSON.stringify(order));
// };

// export { connect, sendMsg, sendOrder };
