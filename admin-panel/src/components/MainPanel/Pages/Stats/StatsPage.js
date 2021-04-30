import { TextField } from "@material-ui/core";
import React, { Component } from "react";
import { connect, sendMsg } from "../../../../socket";

class StatsPage extends Component {
  constructor(props) {
    super(props);
    connect((msg) => {
      console.log("Entered");
    });
    this.state = {
      comment: "",
      chatHistory: [],
    };
    this.onChange = this.onChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {}

  sendMessage = (e) => {
    e.preventDefault();
    let data = {
      msg: this.state.comment,
    };
    sendMsg(data);
    // axios.post("http://localhost:8080/sse/sendmessage", data).then((res) => {
    //   console.log(res);
    // });
    // sendMessage(this.state.comment);
  };
  render() {
    return (
      <div>
        <TextField
          id="comments"
          name="comment"
          label="Σχόλια"
          variant="outlined"
          placeholder="Έξτρα σχόλια"
          rows={4}
          multiline
          className="pre-complete-input"
          onChange={this.onChange}
        />
        <button onClick={this.sendMessage}></button>
      </div>
    );
  }
}

export default StatsPage;
