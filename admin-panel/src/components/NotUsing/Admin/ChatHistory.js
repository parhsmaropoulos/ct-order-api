import React, { Component } from "react";

class ChatHistory extends Component {
  render() {
    const messages = this.props.chatHistory.map((msg, index) => {
      let message = JSON.parse(msg.data);
      let order = JSON.parse(message.body);
      // console.log(order.order);
      return (
        <p key={index}>
          {order.order.user_id}{" "}
          <button onClick={() => console.log("accepted")}>Accept</button>
        </p>
      );
    });

    return (
      <div className="ChatHistory">
        <h2>Chat History</h2>
        {messages}
      </div>
    );
  }
}

export default ChatHistory;
