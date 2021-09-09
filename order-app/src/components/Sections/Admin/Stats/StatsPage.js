import { TextField } from "@material-ui/core";
import React, { Component } from "react";
// import { connect, sendMsg } from "../../../../socket";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Loader from "react-spinners/ClipLoader";

class StatsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      id: 0,
      chatHistory: [],
      awaiting: false,
      accepted: false,
    };

    this.eventSource = new EventSource(
      `http://localhost:8080/sse/events/${props.match.params.id}`
    );

    this.onChange = this.onChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    // console.log(props);
    if (props.match.params) {
      return {
        id: props.match.params.id,
      };
    }
    return null;
  }

  static propTypes = {
    userReducer: PropTypes.object.isRequired,
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  recieveOrder(response) {
    let data = JSON.parse(response.data);
    if (this.state.commnet !== null) {
      if (data.from === String(this.state.id)) {
        console.log("We did it bitches");
      }
    }

    this.setState({
      awaiting: false,
      accepted: data.accepted,
    });

    console.log(data);
  }

  componentDidMount() {
    this.eventSource.onmessage = (e) => this.recieveOrder(e);
  }

  sendMessage = (e) => {
    e.preventDefault();
    let data = {
      id: this.state.comment,
      order: this.state.comment,
      from: this.state.id,
    };
    console.log(data);

    axios
      .post(`http://localhost:8080/sse/sendorder/${this.state.id}`, data)
      .then((res) => {
        this.setState({
          awaiting: true,
        });
      });
  };
  render() {
    if (this.state.awaiting) {
      return (
        <div>
          <Loader />
        </div>
      );
    } else {
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
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
});

export default connect(mapStateToProps)(StatsPage);
