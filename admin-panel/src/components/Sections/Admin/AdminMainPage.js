import React, { Component } from "react";
import { connect } from "react-redux";
import { CircularProgress, Container, Grid } from "@material-ui/core";
import "../../../css/Pages/adminpage.css";
import {
  get_items,
  get_categories,
  get_choices,
  get_ingredients,
} from "../../../actions/items";

import axios from "axios";
import PropTypes from "prop-types";
import Sidebar from "./Components/Sidebar";
import { tabs } from "./Common/tabs";
import RightContainer from "./Components/RightContainer";
import { get_comments } from "../../../actions/comments";
import { get_order, get_today_orders } from "../../../actions/orders";

class AdminMainPage extends Component {
  constructor(props) {
    super(props);

    this.eventSource = new EventSource(
      "http://localhost:8080/sse/events/admin"
    );
    this.state = {
      orders: [],
      selected_time: 0,
      selected_tab: "",
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeTab = this.changeTab.bind(this);
  }

  static propTypes = {
    get_items: PropTypes.func.isRequired,
    get_order: PropTypes.func.isRequired,
    get_categories: PropTypes.func.isRequired,
    get_today_orders: PropTypes.func.isRequired,
    get_choices: PropTypes.func.isRequired,
    get_ingredients: PropTypes.func.isRequired,
    get_comments: PropTypes.func.isRequired,
    orderReducer: PropTypes.object.isRequired,
    adminReducer: PropTypes.object.isRequired,
    productReducer: PropTypes.object.isRequired,
  };

  changeTab = (tab) => {
    // console.log(tab);
    this.setState({ selected_tab: tab });
  };

  onSelectChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  recieveOrder(order) {
    let data = JSON.parse(order.data);
    console.log(data);
    this.props.get_order(data);
    this.setState({
      selectedTab: "Εισερχόμενες",
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
    this.eventSource.onmessage = (e) => this.recieveOrder(e);
  }
  componentWillUnmount() {
    console.log("im getting outta here");
  }
  static propTypes = {};
  render() {
    if (this.props.productReducer.isReady === false) {
      this.props.get_items();
      this.props.get_choices();
      this.props.get_ingredients();
      this.props.get_categories();
      if (this.props.adminReducer.orders_loaded_today === false) {
        this.props.get_today_orders();
      }
      if (this.props.adminReducer.loaded === false) {
        this.props.get_comments();
      }
      return (
        <div className="loading-div">
          <CircularProgress disableShrink />{" "}
        </div>
      );
    }
    return (
      <Container className="adminPanel">
        <Grid container spacing={2}>
          <Grid item xs={2} className="leftColMenu">
            <Sidebar
              tabs={tabs}
              selectedTab={this.state.selected_tab}
              onSelectChange={(selected_tab) => this.changeTab(selected_tab)}
            />
          </Grid>
          <Grid item xs={10} className="menuItemContainer">
            <RightContainer
              ingredients={this.props.productReducer.ingredients}
              ingredientCategories={
                this.props.productReducer.ingredientCategories
              }
              products={this.props.productReducer.products}
              comments={this.props.adminReducer.comments}
              orders={this.props.adminReducer.orders}
              categories={this.props.productReducer.categories}
              selectedTab={this.state.selected_tab}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  productReducer: state.productReducer,
  adminReducer: state.adminReducer,
  orderReducer: state.orderReducer,
});

export default connect(mapStateToProps, {
  get_items,
  get_categories,
  get_choices,
  get_ingredients,
  get_comments,
  get_order,
  get_today_orders,
})(AdminMainPage);
