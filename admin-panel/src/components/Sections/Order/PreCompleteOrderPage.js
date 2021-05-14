import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../../css/Pages/orderpage.css";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import {
  send_order,
  empty_cart,
  order_accepted,
  clearReducer,
} from "../../../actions/orders";
import { getUser } from "../../../actions/user";
import {
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  List,
  TextField,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
} from "@material-ui/core";
import AddressModal from "../../Modals/AddressModal";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import EditAddressModal from "../../Modals/EditAddressModal";
import { showErrorSnackbar } from "../../../actions/snackbar";
import { FormLabel } from "react-bootstrap";

const availableTipOptions = [0.5, 1.0, 1.5, 2.0, 5.0, 10.0];

class PreCompleteOrderPage extends Component {
  constructor(props) {
    super(props);
    this.eventSource = new EventSource(
      `http://localhost:8080/sse/events/${props.match.params.id}`
    );
    this.state = {
      id: 0,
      availableAddress: [],
      payment_type: "Cash",
      payWithCard: false,
      payWithCash: true,
      payWithPaypal: false,
      deliveryOption: "Delivery",
      userDetails: {
        bellName: "",
        floor: "",
      },
      selectedAddress: {},
      tips: "0",
      comments: "",
      showAddressModal: false,
      showEditModal: false,
      phone: "",
      orderStatus: {
        accepted: false,
        timeToDelivery: 0,
        send: false,
        awaiting: false,
      },
      hasLoaded: false,
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.recieveOrder = this.recieveOrder.bind(this);
    this.sendOrder = this.sendOrder.bind(this);
    this.handlePaymentChange = this.handlePaymentChange.bind(this);
    this.handleTipsChange = this.handleTipsChange.bind(this);
  }

  static propTypes = {
    send_order: PropTypes.func.isRequired,
    showErrorSnackbar: PropTypes.func.isRequired,
    empty_cart: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    order_accepted: PropTypes.func.isRequired,
    userReducer: PropTypes.object.isRequired,
    orderReducer: PropTypes.object.isRequired,
    clearReducer: PropTypes.func.isRequired,
  };
  handleTipsChange(tip) {
    this.setState({ tips: tip });
  }

  recieveOrder(response) {
    // console.log("here");
    let data = JSON.parse(response.data);
    console.log(data);
    // let orderStatus = this.state.orderStatus;
    // orderStatus.accepted = data.accepted;
    // orderStatus.awaiting = false;
    // orderStatus.timeToDelivery = data.time;
    this.props.order_accepted(data.time);
  }

  handlePaymentChange = (type) => {
    switch (type) {
      case "cash":
        document.getElementById("tip-div").style.display = "block";
        this.setState({
          payWithCard: false,
          payWithCash: true,
          payWithPaypal: false,
          payment_type: "cash",
        });
        break;
      case "card":
        document.getElementById("tip-div").style.display = "none";
        this.setState({
          payWithCard: true,
          payWithCash: false,
          payWithPaypal: false,
          payment_type: "card",
        });
        break;
      case "paypal":
        document.getElementById("tip-div").style.display = "none";
        this.setState({
          payWithCard: false,
          payWithCash: false,
          payWithPaypal: true,
          payment_type: "paypal",
        });
        break;
      default:
        break;
    }
  };

  selectAddressModal = (showadd, showedit, address) => {
    console.log(showadd, showedit, address);
    this.setState({
      showAddressModal: showadd,
      showEditModal: showedit,
      selectedAddress: address,
    });
    // console.log(address);
    // this.setState({
    //   showAddressModal: showadd,
    //   showEditModal: showedit,
    //   selectedAddress: address,
    // });
  };

  sendOrder = (e) => {
    // check input requirements
    const order = {
      products: this.props.orderReducer.products,
      user_id: this.props.userReducer.user.id,
      delivery_type: this.state.deliveryOption,
      pre_discount_price: this.props.orderReducer.totalPrice,
      payment_type: this.state.payment_type,
      tips: parseFloat(this.state.tips),
      comments: this.state.comments,
      user_details: {
        name: this.props.userReducer.user.name,
        surname: this.props.userReducer.user.surname,
        address: this.state.selectedAddress,
        phone: this.state.phone,
        bell_name: this.state.userDetails.bellName,
        floor: this.state.userDetails.floor,
      },
    };

    if (this.validateFields(order)) {
      this.props.send_order(order);
      // console.log(order);
    }
  };

  validateFields = (order) => {
    const mobilePhoneRegex = new RegExp(/^69[0-9]{8}/);
    const homePhoneRegex = new RegExp(/^21[0-9]{8}/);
    if (order.delivery_type === "") {
      this.props.showErrorSnackbar("Please select delivery type");
      return false;
    } else if (order.payment_type === "") {
      this.props.showErrorSnackbar("Please select payment type");
      return false;
    } else if (order.user_details.address === "") {
      this.props.showErrorSnackbar("Please select an adress");
      return false;
    } else if (
      order.user_details.floor === "" ||
      order.user_details.bell_name === ""
    ) {
      this.props.showErrorSnackbar("Please enter floor and bell name");
      return false;
    } else if (
      (mobilePhoneRegex.test(order.user_details.phone) === false &&
        homePhoneRegex.test(order.user_details.phone) === false) ||
      order.user_details.length > 10
    ) {
      this.props.showErrorSnackbar("Please enter valid phone number");
      return false;
    } else {
      return true;
    }
  };

  onChange = (e) => {
    let userDetails = this.state.userDetails;
    switch (e.target.name) {
      case "comment":
        this.setState({ comments: e.target.value });
        break;
      case "bellName":
        userDetails.bellName = e.target.value;
        this.setState({ userDetails: userDetails });
        break;
      case "floorNumber":
        userDetails.floor = e.target.value;
        this.setState({ userDetails: userDetails });
        break;
      case "phone":
        this.setState({ phone: e.target.value });
        break;
      default:
        break;
    }
  };

  onSelectChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onAddressChange = (e) => {
    this.setState({
      selectedAddress: this.props.userReducer.user.addresses[e.target.value],
    });
  };

  componentDidMount() {
    this.eventSource.onmessage = (e) => this.recieveOrder(e);
    console.log(this.props);
    if (this.props.userReducer.user !== null) {
      if (this.props.userReducer.user.addresses.length > 0) {
        this.setState({
          selectedAddress: this.props.userReducer.user.addresses[0],
        });
      }
      if (this.props.userReducer.user.last_order !== null) {
        let newDetails = this.state.userDetails;
        let last = this.props.userReducer.user.last_order;
        newDetails.bellName = last.user_details.Bell_name;
        newDetails.floor = last.user_details.Floor;
        this.setState({
          userDetails: newDetails,
          phone: last.user_details.Phone,
        });
      }
    }
  }
  componentWillUnmount() {
    if (this.props.orderReducer.sent && !this.props.orderReducer.pending) {
      this.props.clearReducer();
    }
  }

  showEditModal = (bool) => {
    this.setState({
      showEditModal: bool,
    });
  };

  render() {
    let addAddressModal;
    let editAddressModal;
    let authenticated =
      sessionStorage.getItem("isAuthenticated") === "true" ? true : false;
    if (!authenticated) {
      return <Redirect to="/order" />;
    }
    if (this.state.showAddressModal) {
      addAddressModal = (
        <AddressModal
          displayModal={this.state.showAddressModal}
          closeModal={() => this.selectAddressModal(false, false, "")}
          editAddress={(showAdd, showEdit, address) =>
            this.selectAddressModal(showAdd, showEdit, address)
          }
        />
      );
    }
    if (this.state.showEditModal) {
      editAddressModal = (
        <EditAddressModal
          address={this.state.selectedAddress}
          updateAddress={false}
          displayModal={this.state.showEditModal}
          closeModal={() => this.showEditModal(false)}
        />
      );
    }
    if (this.props.orderReducer.pending && !this.props.orderReducer.recieved) {
      console.log("3");
      return (
        <div className="loading-div">
          <CircularProgress disableShrink />{" "}
        </div>
      );
    }
    if (this.props.orderReducer.sent && !this.props.orderReducer.pending) {
      console.log(this.props.orderReducer.timeToDelivery);
      return (
        <div className="loading-div">
          Your order has been{" "}
          {this.props.orderReducer.accepted ? <p>accepted</p> : <p>declined</p>}
          {this.props.orderReducer.accepted ? (
            <span>
              It will be there in {this.props.orderReducer.timeToDelivery}
            </span>
          ) : (
            <span></span>
          )}
          <Link to="/home">
            <Button>OK</Button>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="pre-order-container">
          <div className="pre-order-container-body">
            <div className="pre-order-col pre-order-user-details">
              <div className="pre-order-col-container">
                <div className="pre-order-col-title">1. User Details</div>
                <div className="pre-order-col-subdiv">
                  <FormControl className="selectDeliveryControl">
                    <InputLabel id="selectDeliveryLabel">
                      Τρόπος παραγγελίας
                    </InputLabel>
                    <Select
                      labelId="selectDeliveryLabel"
                      id="selectDelivery"
                      name="deliveryOption"
                      onChange={this.onSelectChange}
                      required
                      defaultValue="Delivery"
                    >
                      <MenuItem value="Delivery">Delivery</MenuItem>
                      <MenuItem value="TakeAway">
                        Παραλαβή απο το κατάστημα
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="pre-order-col-subdiv">
                  <FormControl className="selectAddressControl">
                    <InputLabel id="selectAddressLabel">
                      Select Address
                    </InputLabel>
                    <Select
                      labelId="selectAddressLabel"
                      id="selectAddress"
                      name="selectedAddress"
                      value={
                        this.props.userReducer.user.addresses.length > 0
                          ? "0"
                          : ""
                      }
                      onChange={this.onAddressChange}
                      required
                    >
                      {this.props.userReducer.user.addresses.map(
                        (address, index) => {
                          return (
                            <MenuItem value={index} key={index}>
                              {address.address_name} {address.address_number},{" "}
                              {address.area_name}
                            </MenuItem>
                          );
                        }
                      )}
                      <MenuItem
                        onClick={() => this.selectAddressModal(true, false, "")}
                      >
                        Add new
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="pre-order-col-subdiv">
                  <form className="pre-order-info-form">
                    <div className="pre-order-info-form-row">
                      <TextField
                        id="bellName"
                        name="bellName"
                        value={this.state.userDetails.bellName}
                        label="Κουδούνι *"
                        variant="outlined"
                        placeholder="Όνομα στο κουδούνι"
                        className="pre-complete-input"
                        onChange={this.onChange}
                      />
                    </div>
                    <div className="pre-order-info-form-row">
                      <div className="form-custom-row-group">
                        <TextField
                          id="floorNumber"
                          name="floorNumber"
                          label="Όροφος *"
                          value={this.state.userDetails.floor}
                          variant="outlined"
                          placeholder="Όροφος"
                          className="pre-complete-input"
                          onChange={this.onChange}
                        />
                      </div>
                      <div className="form-custom-row-group">
                        <TextField
                          id="phone"
                          type="tel"
                          name="phone"
                          inputProps={{
                            pattern: "69[0-9]{8}",
                          }}
                          label="Τηλέφωνο επικοινωνίας"
                          value={this.state.phone}
                          variant="outlined"
                          placeholder="Τηλέφωνο επικοινωνίας: 69xxxxxxxx"
                          className="pre-complete-input"
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="pre-order-info-form-row">
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
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="pre-order-col pre-order-payment-details">
              <div className="pre-order-col-container">
                <div className="pre-order-col-title">2. Payment Options</div>
                <div className="pre-order-col-subdiv">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.payWithCard}
                        onChange={() => this.handlePaymentChange("card")}
                        name="Card"
                      />
                    }
                    label="Credit Card"
                  />
                </div>
                <div className="pre-order-col-subdiv">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.payWithPaypal}
                        onChange={() => this.handlePaymentChange("paypal")}
                        name="Paypal"
                      />
                    }
                    label="Paypal"
                  />
                </div>
                <div className="pre-order-col-subdiv">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.payWithCash}
                        onChange={() => this.handlePaymentChange("cash")}
                        name="Cash"
                      />
                    }
                    label="Cash"
                  />
                </div>
                <div
                  className="pre-order-col-subdiv"
                  id="tip-div"
                  style={{ display: "block" }}
                >
                  <FormControl>
                    <FormLabel>Select Tips</FormLabel>
                    <FormGroup row={true}>
                      {availableTipOptions.map((option, index) => {
                        let active = false;
                        if (this.state.tips === option) {
                          active = true;
                        }
                        return (
                          <FormControlLabel
                            key={index}
                            value={String(option)}
                            control={
                              <Checkbox
                                checked={active}
                                name={option.toString()}
                                onChange={() => this.handleTipsChange(option)}
                              />
                            }
                            label={option}
                          />
                        );
                      })}
                    </FormGroup>
                  </FormControl>
                </div>
              </div>
            </div>
            <div className="pre-order-col pre-order-complete-order">
              <div className="pre-order-col-container">
                <div className="pre-order-col-title">3. Complete Order</div>
                <div className="pre-order-col-subdiv">
                  <span>Σύνολο: {this.props.orderReducer.totalPrice} €</span>
                  <br />
                  <button
                    className="complete-order-button"
                    type="submit"
                    onClick={this.sendOrder}
                  >
                    Αποστολή{" "}
                  </button>
                </div>
                <div className="pre-order-col-subdiv">
                  <List className="pre-order-item-list">
                    {this.props.orderReducer.products.map((prod, index) => {
                      return (
                        <ListItem
                          key={index}
                          disabled
                          className="pre-order-item-list-item"
                        >
                          <ListItemText
                            type="li"
                            primary={`${prod.quantity} x ${prod.item.name}`}
                            secondary={`${prod.optionAnswers.join()} , ${
                              prod.comment
                            }`}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                  <span>payment-details</span>
                  <br />
                </div>
              </div>
            </div>
          </div>
          {addAddressModal}
          {editAddressModal}
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
  orderReducer: state.orderReducer,
});
export default connect(mapStateToProps, {
  send_order,
  showErrorSnackbar,
  empty_cart,
  order_accepted,
  clearReducer,
  getUser,
})(PreCompleteOrderPage);
