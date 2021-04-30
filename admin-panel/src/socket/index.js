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

const url = "ws://localhost:8080/socket/ws";
const socket = new WebSocket(url);

let connect = (cb) => {
  console.log("connecting");

  socket.onopen = () => {
    console.log("Successfully Connected");
  };

  socket.onmessage = (msg) => {
    console.log(msg);
    console.log(cb);
    cb(msg);
  };

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = (error) => {
    console.log("Socket Error: ", error);
  };
};

let sendMsg = (msg) => {
  console.log("sending msg: ", msg);
  socket.send(msg);
};
// ws.onmessage = function (msg) {
//   console.log(msg);
//   //   insertMessage(JSON.parse(msg.data));
// };

// function sendMessage(message) {
//   ws.send(JSON.stringify(message));
// }

export { connect, sendMsg };
/**
 * Insert a message into the UI
 * @param {Message that will be displayed in the UI} messageObj
 */
// function insertMessage(messageObj) {
//   // Create a div object which will hold the message
//   const message = document.createElement("div");

//   // Set the attribute of the message div
//   message.setAttribute("class", "chat-message");
//   console.log(
//     "name: " + messageObj.username + " content: " + messageObj.content
//   );
//   message.textContent = `${messageObj.username}: ${messageObj.content}`;

//   // Append the message to our chat div
//   messages.appendChild(message);

//   // Insert the message as the first message of our chat
//   messages.insertBefore(message, messages.firstChild);
// }
