const socket = new WebSocket(
  `ws://${
    process.env.REACT_APP_ENV === "dev"
      ? "localhost:8080"
      : "api.ct-dashboard.gr"
  }/ws/${sessionStorage.getItem("userID")}`
);

let WebSocketConnect = () => {
  console.log("Attempting Connection...");

  socket.onopen = () => {
    console.log("Successfully Connected");
  };

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
    // WebSocketConnect();
  };

  socket.onerror = (error) => {
    console.log("Socket Error: ", error);
  };
};

let sendMsg = (msg) => {
  //   console.log("sending msg: ", msg);
  socket.send(msg);
};

export { WebSocketConnect, sendMsg, socket };
