import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
import "../../../css/Pages/adminpage.css";
import axios from "axios";
import { FormControl } from "react-bootstrap";

class AdminMainPage extends Component {
  constructor(props) {
    super(props);

    this.eventSource = new EventSource(
      "http://localhost:8080/sse/events/admin"
    );
    this.state = {
      orders: [],
      selected_time: 0,
    };
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  onSelectChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  recieveOrder(order) {
    let data = JSON.parse(order.data);
    console.log(data);
    this.setState({
      orders: [...this.state.orders, data],
    });
  }

  acceptOrder(order) {
    let data = {
      id: order.id,
      accepted: true,
      time: this.state.selected_time,
      from: order.from,
    };
    axios.post(`http://localhost:8080/sse/acceptorder`, data).then((res) => {
      let orders = this.state.orders;
      const newOrders = orders.filter((ord) => ord.id !== data.id);
      this.setState({ orders: newOrders });
    });
  }

  rejectOrder(order) {
    let data = {
      id: order.id,
      accepted: false,
      time: 0,
      from: order.from,
    };
    axios.post(`http://localhost:8080/sse/acceptorder`, data).then((res) => {
      let orders = this.state.orders;
      const newOrders = orders.filter((ord) => ord.id !== data.id);
      this.setState({ orders: newOrders });
    });
  }

  componentDidMount() {
    console.log(this.state);

    this.eventSource.onmessage = (e) => this.recieveOrder(e);
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
            {this.state.orders.map((order, id) => {
              return (
                <div key={id}>
                  {order.id}{" "}
                  <button onClick={() => this.acceptOrder(order)}>
                    accept
                  </button>
                  <button onClick={() => this.rejectOrder(order)}>
                    Reject
                  </button>
                </div>
              );
            })}
            Container
          </Grid>
        </Grid>
        {/* <ChatHistory chatHistory={this.state.chatHistory} /> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(AdminMainPage);
