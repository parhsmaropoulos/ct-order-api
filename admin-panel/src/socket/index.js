// import openSocket, { socketIOClient, io } from "socket.io-client";
// const socket = io("http://localhost:8080/socket.io/");

// function connectSocket(cb) {
//   // listen for any messages coming through
//   // of type 'chat' and then trigger the
//   // callback function with said message
//   socket.on("chat", (message) => {
//     // console.log the message for posterity
//     console.log(message);
//     // trigger the callback passed in when
//     // our App component calls connect
//     cb(message);
//   });
//   socket.on("connect", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
//   });

//   socket.on("disconnect", () => {
//     console.log(socket.id); // undefined
//   });
// }

// export { connectSocket, socket };
