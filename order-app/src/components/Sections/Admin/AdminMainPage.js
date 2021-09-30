import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Grid } from "@material-ui/core";
import "../../../css/Pages/adminpage.css";
import PropTypes from "prop-types";
import Sidebar from "./Components/Sidebar";
import { tabs } from "./Common/tabs";
import RightContainer from "./Components/RightContainer";
import {
  ACCEPT_ORDER,
  GET_CATEGORIES,
  GET_CHOICES,
  GET_INGREDIENTS,
  GET_ITEMS,
  TODAY_ORDERS,
} from "../../../actions/actions";
import {
  auth_get_request,
  get_request,
  post_request,
} from "../../../actions/lib";
import { get_order } from "../../../actions/orders";

class AdminMainPage extends Component {
  constructor(props) {
    super(props);

    this.eventSource = new EventSource(
      "http://localhost:8080/sse/events/admin"
    );
    this.state = {
      orders: [],
      incomings: [],
      selected_time: 0,
      selected_tab: "",
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.changeTab = this.changeTab.bind(this);
  }

  static propTypes = {
    orderReducer: PropTypes.object.isRequired,
    adminReducer: PropTypes.object.isRequired,
    productReducer: PropTypes.object.isRequired,
    auth_get_request: PropTypes.func.isRequired,
    post_request: PropTypes.func.isRequired,
    get_request: PropTypes.func.isRequired,
    get_order: PropTypes.func.isRequired,
  };

  changeTab = (tab) => {
    this.setState({ selected_tab: tab });
  };

  onSelectChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async recieveOrder(order) {
    let data = JSON.parse(order.data);
    // console.log(data);
    this.props.get_order(data.order);

    this.setState({
      selectedTab: "Εισερχόμενες",
    });
  }

  async acceptOrder(order) {
    let data = {
      id: order.ID,
      accepted: true,
      time: this.state.selected_time,
      from: order.from,
    };
    await this.props.post_request(
      `http://localhost:8080/sse/acceptorder`,
      data,
      ACCEPT_ORDER
    );

    let orders = this.state.orders;
    const newOrders = orders.filter((ord) => ord.ID !== data.id);
    this.setState({
      orders: newOrders,
    });
  }

  async rejectOrder(order) {
    let data = {
      id: order.ID,
      accepted: false,
      time: 0,
      from: order.from,
    };
    await this.props.post_request(
      `http://localhost:8080/sse/acceptorder`,
      data,
      ACCEPT_ORDER
    );
    let orders = this.state.orders;
    const newOrders = orders.filter((ord) => ord.ID !== data.id);
    this.setState({
      orders: newOrders,
    });
  }

  componentDidMount() {
    this.eventSource.onmessage = (e) => this.recieveOrder(e);
    this.get_categories();
    this.get_choices();
    this.get_ingredients();
    this.get_items();
    this.get_today();
  }

  async get_items() {
    await this.props.get_request("products/all", GET_ITEMS);
  }
  async get_categories() {
    await this.props.get_request("product_category/all", GET_CATEGORIES);
  }
  async get_choices() {
    await this.props.get_request("product_choices/all", GET_CHOICES);
  }
  async get_ingredients() {
    await this.props.get_request("ingredients/all", GET_INGREDIENTS);
  }
  async get_today() {
    await this.props.get_request("admin/today", TODAY_ORDERS);
  }
  componentWillUnmount() {
    console.log("im getting outta here");
  }
  render() {
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
  auth_get_request,
  get_request,
  get_order,
  post_request,
})(AdminMainPage);
