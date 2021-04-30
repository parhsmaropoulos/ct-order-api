import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../../../css/Pages/orderpage.css";
import { Redirect } from "react-router";
import { send_order } from "../../../../actions/orders";
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
} from "@material-ui/core";
import AddressModal from "../../../Layout/AddressModal";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import EditAddressModal from "../../../Layout/EditAddressModal";
import { showErrorSnackbar } from "../../../../actions/snackbar";

class PreCompleteOrderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      tips: 0,
      comments: "",
      showAddressModal: false,
      showEditModal: false,
      phone: "",
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.sendOrder = this.sendOrder.bind(this);
    this.handlePaymentChange = this.handlePaymentChange.bind(this);
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

  static propTypes = {
    send_order: PropTypes.func.isRequired,
    showErrorSnackbar: PropTypes.func.isRequired,
  };

  selectAddressModal = (showadd, showedit, address) => {
    console.log(address);
    this.setState({
      showAddressModal: showadd,
      showEditModal: showedit,
      selectedAddress: address,
    });
  };

  sendOrder = (e) => {
    // check input requirements
    const data = {
      products: this.props.orderReducer.products,
      user_id: this.props.userReducer.user.id,
      delivery_type: this.state.deliveryOption,
      pre_discount_price: this.props.orderReducer.totalPrice,
      payment_type: this.state.payment_type,
      tips: this.state.tips,
      comments: this.state.comments,
      address: this.state.selectedAddress,
      phone: this.state.phone,
      bell_name: this.state.userDetails.bellName,
      floor: this.state.userDetails.floor,
    };

    if (
      data.delivery_type === "" ||
      data.payment_type === "" ||
      data.address === "" ||
      data.floor === "" ||
      data.bell_name === "" ||
      data.phone === ""
    ) {
      this.props.showErrorSnackbar("Please fill all the fields");
    } else {
      this.props.send_order(data);
    }
    console.log(data);
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
    console.log(this.state.selectedAddress);
  };

  componentDidMount() {
    if (this.props.userReducer.isAuthenticated === false) {
      return <Redirect to="/home" />;
    }
  }
  static propTypes = {
    userReducer: PropTypes.object.isRequired,
    orderReducer: PropTypes.object.isRequired,
  };

  showEditModal = (bool) => {
    this.setState({
      showEditModal: bool,
    });
  };

  render() {
    let addAddressModal;
    let editAddressModal;
    if (this.state.showAddressModal) {
      addAddressModal = (
        <AddressModal
          displayModal={this.state.showAddressModal}
          closeModal={(showadd, showedit, address) =>
            this.selectAddressModal(showadd, showedit, address)
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
    if (this.props.orderReducer.pending) {
      return (
        // <Redirect to="/waiting" />
        <div className="loading-div">
          <CircularProgress disableShrink />;
        </div>
      );
    }
    if (this.props.userReducer.isAuthenticated === false) {
      return <Redirect to="/home" />;
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
                      defaultChecked="Delivery"
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
                          label="Τηλέφωνο επικοινωνίας"
                          variant="outlined"
                          placeholder="Τηλέφωνο επικοινωνίας"
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
                  tipss
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
export default connect(mapStateToProps, { send_order, showErrorSnackbar })(
  PreCompleteOrderPage
);
