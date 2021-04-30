import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import "../../../../css/Pages/adminpage.css";
import ChatHistory from "./ChatHistory";
import { connect as c } from "../../../../socket/index";

class AdminMainPage extends Component {
  constructor(props) {
    super(props);
    c((msg) => {
      console.log(msg);
      this.setState((prevState) => ({
        chatHistory: [...this.state.chatHistory, msg],
      }));
      console.log(this.state);
    });
    this.state = {
      chatHistory: [],
    };
  }
  componentDidMount() {
    console.log(this.state);
    // c((msg) => {
    //   console.log("New Message");
    //   this.setState((prevState) => ({
    //     chatHistory: [...this.state.chatHistory, msg],
    //   }));
    //   console.log(this.state);
    // });
    // axios.get("http://localhost:8080/sse/handeshake").then((res) => {
    //   console.log(res);
    // });
  }
  static propTypes = {};
  render() {
    return (
      <div className="adminPanel">
        <Grid container spacing={2}>
          <Grid item xs className="leftColMenu">
            <div className="menuItemContainer">
              <div className="menuItemText">Orders</div>
            </div>
            <div className="menuItemContainer">Users</div>
            <div className="menuItemContainer">Order!s</div>
            <div className="menuItemContainer">Order!s</div>
          </Grid>
          <Grid item xs={9} className="menuContainer">
            Container
          </Grid>
        </Grid>
        <ChatHistory chatHistory={this.state.chatHistory} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(AdminMainPage);
