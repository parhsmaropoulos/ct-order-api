import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./Checkout.css";
import { Link } from "react-router-dom";
import {
  send_order,
  empty_cart,
  order_accepted,
  order_declined,
  clearReducer,
} from "../../../actions/orders";
import { getUser } from "../../../actions/user";
import { CircularProgress, Button } from "@material-ui/core";

import { showErrorSnackbar } from "../../../actions/snackbar";
import { auth_get_request, auth_post_request } from "../../../actions/lib";
import { GET_USER, SEND_ORDER } from "../../../actions/actions";

import withAuthorization from "../../../firebase/withAuthorization";
import AddressModal1 from "../../Modals/AddressModal1";
import EditAddressModal1 from "../../Modals/EditAddressModal1";

// const availableTipOptions = [0.5, 1.0, 1.5, 2.0, 5.0, 10.0];

class Checkout extends Component {
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
      paid: false,
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.recieveOrder = this.recieveOrder.bind(this);
    this.sendOrder = this.sendOrder.bind(this);
    this.callPayment = this.callPayment.bind(this);
    this.handlePaymentChange = this.handlePaymentChange.bind(this);
    this.handleTipsChange = this.handleTipsChange.bind(this);
  }

  static propTypes = {
    send_order: PropTypes.func.isRequired,
    showErrorSnackbar: PropTypes.func.isRequired,
    empty_cart: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    order_accepted: PropTypes.func.isRequired,
    order_declined: PropTypes.func.isRequired,
    userReducer: PropTypes.object.isRequired,
    orderReducer: PropTypes.object.isRequired,
    clearReducer: PropTypes.func.isRequired,
    auth_get_request: PropTypes.func.isRequired,
    auth_post_request: PropTypes.func.isRequired,
  };
  handleTipsChange(tip) {
    this.setState({ tips: tip });
  }

  recieveOrder(response) {
    let data = JSON.parse(response.data);
    if (data.accepted === true) {
      this.props.order_accepted(data.time);
    } else {
      this.props.order_declined();
    }
  }

  handlePaymentChange = (type) => {
    console.log(type);
    switch (type) {
      case "cash":
        // document.getElementById("tip-div").style.display = "block";
        this.setState({
          payWithCard: false,
          payWithCash: true,
          payWithPaypal: false,
          payment_type: "cash",
        });
        break;
      case "card":
        // document.getElementById("tip-div").style.display = "none";
        this.setState({
          payWithCard: true,
          payWithCash: false,
          payWithPaypal: false,
          payment_type: "card",
        });
        break;
      case "paypal":
        // document.getElementById("tip-div").style.display = "none";
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
    // console.log(showadd, showedit, address);
    this.setState({
      showAddressModal: showadd,
      showEditModal: showedit,
      selectedAddress: address,
    });
  };

  // Convert order products to our form
  convertToOrderProducts = (products) => {
    let orderProducts = [];

    products.forEach(function (product) {
      let orderProduct = {
        comment: product.comment,
        price: product.item.price,
        extra_price: product.extraPrice,
        extra_ingredientes: product.extra_ingredientes,
        item_name: product.item.name,
        option_answers: product.optionAnswers,
        quantity: product.quantity,
        total_price: product.totalPrice,
      };
      orderProducts.push(orderProduct);
    });

    return orderProducts;
  };

  async callPayment(e) {
    e.preventDefault();
    // check input requirements
    const order = {
      products: this.convertToOrderProducts(this.props.orderReducer.products),
      user_id: this.props.userReducer.user.ID,
      delivery_type: this.state.deliveryOption,
      pre_discount_price: this.props.orderReducer.totalPrice,
      after_discount_price: this.props.orderReducer.totalPrice,
      payment_type: this.state.payment_type,
      tips: parseFloat(this.state.tips),
      comments: this.state.comments,
      discounts: [],
      name: this.props.userReducer.user.name,
      surname: this.props.userReducer.user.surname,
      client_area_name: this.state.selectedAddress.area_name,
      client_city_name: this.state.selectedAddress.city_name,
      client_address_name: this.state.selectedAddress.address_name,
      client_address_number: this.state.selectedAddress.address_number,
      client_zip: this.state.selectedAddress.zipcode,
      client_lat: this.state.selectedAddress.latitude,
      client_lon: this.state.selectedAddress.longitude,
      phone: parseInt(this.state.phone),
      bell_name: this.state.userDetails.bellName,
      floor: this.state.userDetails.floor,
      delivery_time: 40,
      comment: {},
      accepted: false,
      completed: false,
      canceled: false,
      from_id: sessionStorage.getItem("userID"),
    };
    if (this.validateFields(order)) {
      if (this.state.payWithCard) {
        window.everypay.onClick();
      } else if (this.state.payWithPaypal) {
        //handle paypal payment
      } else if (this.state.payWithCash) {
        this.sendOrder(e);
      }
    }
  }

  async sendOrder(e) {
    if (e) {
      e.preventDefault();
    }
    // check input requirements
    const order = {
      products: this.convertToOrderProducts(this.props.orderReducer.products),
      user_id: this.props.userReducer.user.ID,
      delivery_type: this.state.deliveryOption,
      pre_discount_price: this.props.orderReducer.totalPrice,
      after_discount_price: this.props.orderReducer.totalPrice,
      payment_type: this.state.payment_type,
      tips: parseFloat(this.state.tips),
      comments: this.state.comments,
      discounts: [],
      name: this.props.userReducer.user.name,
      surname: this.props.userReducer.user.surname,
      client_area_name: this.state.selectedAddress.area_name,
      client_city_name: this.state.selectedAddress.city_name,
      client_address_name: this.state.selectedAddress.address_name,
      client_address_number: this.state.selectedAddress.address_number,
      client_zip: this.state.selectedAddress.zipcode,
      client_lat: this.state.selectedAddress.latitude,
      client_lon: this.state.selectedAddress.longitude,
      phone: parseInt(this.state.phone),
      bell_name: this.state.userDetails.bellName,
      floor: this.state.userDetails.floor,
      delivery_time: 40,
      comment: {},
      accepted: false,
      completed: false,
      canceled: false,
      from_id: sessionStorage.getItem("userID"),
    };
    let SSEdata = {
      id: null,
      order: null,
      from: null,
      user_details: null,
    };
    const res = await this.props.auth_post_request(
      `user/new_order`,
      order,
      SEND_ORDER
    );
    let newOrder = res.data.data;
    SSEdata.id = String(newOrder.ID);
    SSEdata.order = newOrder;
    SSEdata.from = String(sessionStorage.getItem("userID"));
    SSEdata.user_details = {};
    await this.props.auth_post_request(
      `sse/sendorder/${SSEdata.from}`,
      SSEdata,
      null
    );
    localStorage.removeItem("cart");
  }

  validateFields = (order) => {
    const mobilePhoneRegex = new RegExp(/^69[0-9]{8}/);
    const homePhoneRegex = new RegExp(/^21[0-9]{8}/);
    if (!!order.delivery_type === false) {
      this.props.showErrorSnackbar("Please select delivery type");
      return false;
    } else if (!!order.payment_type === false) {
      this.props.showErrorSnackbar("Please select payment type");
      return false;
    } else if (!!order.floor === false || !!order.bell_name === false) {
      this.props.showErrorSnackbar("Please enter floor and bell name");
      return false;
    } else if (
      !!order.phone === true &&
      ((mobilePhoneRegex.test(order.phone) === false &&
        homePhoneRegex.test(order.phone) === false) ||
        order.phone.length !== 10)
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
    if (e.target.value === "new") {
      this.selectAddressModal(true, false, "");
    } else {
      this.setState({
        selectedAddress: this.props.userReducer.user.addresses[e.target.value],
      });
    }
  };

  onAddAddress = (address) => {
    this.setState({
      selectedAddress: address,
    });
  };

  async GetUser() {
    await this.props.auth_get_request(
      `user/${sessionStorage.getItem("userID")}`,
      GET_USER
    );
    return;
  }

  async componentDidMount() {
    this.eventSource.onmessage = (e) => this.recieveOrder(e);
    if (this.props.userReducer.user === null) {
      await this.GetUser();
    }
    if (this.props.userReducer.user.addresses) {
      this.setState({
        selectedAddress: this.props.userReducer.user.addresses[0],
      });
    }
    if (this.props.userReducer.user.orders.length) {
      let newDetails = this.state.userDetails;
      let last = this.props.userReducer.user.orders[0];
      newDetails.bellName = last.bell_name;
      newDetails.floor = last.floor;
      newDetails.comments = last.comments;
      this.setState({
        userDetails: newDetails,
        phone: last.phone.length === 10 ? last.phone : null,
      });
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
    if (
      this.props.userReducer.user === null ||
      this.props.userReducer.hasLoaded === false
    ) {
      this.props.auth_get_request(
        `user/${sessionStorage.getItem("userID")}`,
        GET_USER
      );
      return (
        <div className="loading-div">
          <CircularProgress disableShrink />{" "}
        </div>
      );
    }
    if (this.state.showAddressModal) {
      addAddressModal = (
        <AddressModal1
          displayModal={this.state.showAddressModal}
          onClose={() => this.selectAddressModal(false, false, "")}
          addAdress={(address) => this.onAddAddress(address)}
          editAddress={(showAdd, showEdit, address) =>
            this.selectAddressModal(showAdd, showEdit, address)
          }
        />
      );
    }
    if (this.state.showEditModal) {
      editAddressModal = (
        <EditAddressModal1
          address={this.state.selectedAddress}
          updateAddress={false}
          displayModal={this.state.showEditModal}
          onClose={() => this.showEditModal(false)}
        />
      );
    }
    if (this.props.orderReducer.pending && !this.props.orderReducer.recieved) {
      return (
        <div className="loading-div">
          Παρακαλώ περιμένετε.
          <CircularProgress disableShrink />{" "}
        </div>
      );
    }
    if (this.props.orderReducer.sent && !this.props.orderReducer.pending) {
      return (
        <div className="loading-div">
          Η παραγγελία σας{" "}
          {this.props.orderReducer.accepted ? (
            <p>έγινε αποδεκτή</p>
          ) : (
            <p>απορρίφθηκε</p>
          )}
          {this.props.orderReducer.accepted ? (
            <span>
              Θα είναι εκεί σε {this.props.orderReducer.timeToDelivery}
            </span>
          ) : (
            <span></span>
          )}
          <Link to="/home">
            <Button>Επιστροφή</Button>
          </Link>
        </div>
      );
    } else {
      return (
        <div className=" lg:flex lg:flex-row md:flex-row md:flex sm:flex-col sm:flex">
          {addAddressModal}
          {editAddressModal}
          <div className="flex lg:w-2/6 md:w-full sm:w-full  min-h-screen">
            <div className="flex-none w-1/12"></div>
            <OrderDetails
              onSelectChange={this.onSelectChange}
              deliveryOption={this.state.deliveryOption}
              onAddressChange={(e) => this.onAddressChange(e)}
              addresses={this.props.userReducer.user.addresses}
              userDetails={this.state.userDetails}
              onChange={this.onChange}
              phone={this.state.phone}
            />
            <div className="flex-none w-1/12"></div>
          </div>
          <div className="flex lg:w-2/6 md:w-full sm:w-full">
            <div className="flex-none w-1/12"></div>
            <PaymentDetails
              payWithCard={this.state.payWithCard}
              payWithCash={this.state.payWithCash}
              onSelect={(type) => this.handlePaymentChange(type)}
            />
            <div className="flex-none w-1/12"></div>
          </div>
          <div className="flex lg:w-2/6 md:w-full  sm:w-full">
            <div className="flex-none w-1/12"></div>
            <CompleteOrderDetails
              products={this.props.orderReducer.products}
              callPayment={this.callPayment}
              totalPrice={this.props.orderReducer.totalPrice}
            />
            <div className="flex-none w-1/12"></div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
  orderReducer: state.orderReducer,
});

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(
  connect(mapStateToProps, {
    send_order,
    showErrorSnackbar,
    empty_cart,
    order_accepted,
    clearReducer,
    getUser,
    auth_get_request,
    auth_post_request,
    order_declined,
  })(Checkout)
);

const OrderDetails = ({
  onSelectChange,
  deliveryOption,
  onAddressChange,
  addresses,
  userDetails,
  onChange,
  phone,
}) => {
  return (
    <div className="flex-grow l w-10/12 px-6 py-8 bg-white shadow-lg">
      <h1 className="mb-8 font-extrabold text-gray-800 leading-6">
        1.Στοιχεία Παραγγελίας
      </h1>
      <span className="text-gray-600 text-sm">Είδος παραγγελίας</span>
      <div className="flex my-4 w-full items-center">
        <select
          id="deliveryType"
          name="deliveryOption"
          className="focus:ring-indigo-500 w-full border-b-2 border-t-0 border-l-0 border-r-0 border-black focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
          onChange={onSelectChange}
          defaultValue={"Delivery"}
        >
          <option value="Delivery" key={1}>
            Delivery
          </option>
          <option value="TakeAway" key={2}>
            Παραλαβή απο το κατάστημα
          </option>
        </select>
      </div>
      {deliveryOption === "Delivery" && (
        <>
          <span className="text-gray-600 text-sm">Επιλέξτε Διεύθυνση</span>
          <div className="flex my-4 w-full items-center">
            <select
              id="address"
              name="selectedAddress"
              className="focus:ring-indigo-500 w-full border-b-2 border-t-0 border-l-0 border-r-0 border-black focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
              onChange={onAddressChange}
            >
              {addresses ? (
                addresses.map((a, i) => (
                  <option value={i} key={i}>
                    {a.address_name} {a.address_number},{a.area_name}
                  </option>
                ))
              ) : (
                <option>Δεν υπάρχουν διευθύνσεις</option>
              )}
              <option value="new" key={0}>
                Προσθήκη νέας
              </option>
            </select>
          </div>
        </>
      )}

      <div className="text-sm border-b-2 border-l-0 border-r-0 border-t-0 border-gray-400">
        <span className="pl-2 text-gray-700">
          Στοιχεία Παράδωσης <small>* υποχρεωτικά</small>
        </span>
      </div>

      <div className="flex w-full">
        <div className="flex-none w-1/2">
          <label className=" text-gray-700 font-semibold">Κουδούνι *</label>
          <input
            type="text"
            className="w-full shadow rounded-lg bg-gray-100 outline-none focus:bg-gray-200"
            placeholder="Κoυδούνι"
            name="bellName"
            value={userDetails.bellName}
            onChange={onChange}
          />
        </div>

        <div className="flex-none w-1/2 ">
          <label className="text-gray-700 font-semibold">Όροφος *</label>
          <input
            type="text"
            className="w-full shadow rounded-lg bg-gray-100 outline-none focus:bg-gray-200"
            placeholder="Όροφος"
            name="floorNumber"
            value={userDetails.floor}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="flex-col flex ">
        <label className=" text-gray-700 font-semibold">Κινητό </label>
        <input
          type="text"
          className=" shadow rounded-lg bg-gray-100 outline-none focus:bg-gray-200"
          name="phone"
          inputprops={{
            pattern: "69[0-9]{8}",
          }}
          value={phone}
          onChange={onChange}
          placeholder="Τηλέφωνο επικοινωνίας: 69xxxxxxxx"
        />
      </div>

      <div className="flex-col flex ">
        <label className="text-gray-700 font-semibold">Σχόλια</label>
        <textarea
          type="text"
          className="p-2 shadow rounded-lg bg-gray-100 outline-none focus:bg-gray-200"
          placeholder="Έξτρα σχόλια ..."
          name="comment"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

const PaymentDetails = ({ payWithCard, payWithCash, onSelect }) => {
  return (
    <div className="flex-grow l w-10/12 px-6 py-8 bg-white shadow-lg">
      <h1 className="mb-8 font-extrabold text-gray-800 leading-6">
        2.Επιλογή πληρωμής
      </h1>
      <div className="shadow-md">
        <div
          className="tab w-full overflow-hidden border-t"
          onClick={() => onSelect("card")}
        >
          <input
            className="absolute opacity-0"
            id="tab-card"
            type="radio"
            name="payWithCard"
            readOnly
            checked={payWithCard}
          />
          <label
            className="block p-5 leading-normal cursor-pointer"
            htmlFor="tab-single-one"
          >
            Πληρωμή με κάρτα
          </label>
          <div className="tab-content overflow-hidden border-l-2 bg-gray-100 border-indigo-500 leading-normal">
            <p className="p-5">Pay with card through everypay</p>
          </div>
        </div>
        <div
          className="tab w-full overflow-hidden border-t"
          onClick={() => onSelect("cash")}
        >
          <input
            className="absolute opacity-0"
            id="tab-cash"
            type="radio"
            readOnly
            name="payWithCash"
            checked={payWithCash}
          />
          <label
            className="block p-5 leading-normal cursor-pointer"
            htmlFor="tab-single-one"
          >
            Πληρωμή με μετρητά
          </label>
          <div className="tab-content overflow-hidden border-l-2 bg-gray-100 border-indigo-500 leading-normal">
            <p className="p-5">Pay with cash</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompleteOrderDetails = ({ products, callPayment, totalPrice }) => {
  return (
    <div className="flex-grow l w-10/12 px-6 py-8 bg-white shadow-lg">
      <h1 className="mb-8 font-extrabold text-gray-800 leading-6">
        3. Ολοκλήρωση
      </h1>

      <div className="flex item-center mt-2">
        <div className="w-1/12"></div>
        <div className=" bg-white rounded-lg  w-10/12 shadow-lg overflow-auto ">
          <ul className="divide-y-2 divide-gray-100">
            {products.map((p, i) => {
              return <ItemRow key={i} product={p} />;
            })}
          </ul>
        </div>
        <div className="w-1/12"></div>
      </div>
      <div className="flex-col flex py-4">
        <div className="flex-1 font-bold">
          <div className="flex">
            <span className="text-left w-1/2">Σύνολο</span>
            <span className="text-right w-1/2">{totalPrice.toFixed(2)} €</span>
          </div>
        </div>
      </div>
      <div className="p-4 justify-center flex">
        <button
          className=" hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
        hover:bg-teal-700 hover:text-teal-100 
        bg-teal-100 
        text-teal-700 
        border duration-200 ease-in-out 
        border-teal-600 transition"
          onClick={callPayment}
        >
          Αποστολή
        </button>
      </div>
    </div>
  );
};

const ItemRow = ({ product }) => {
  return (
    <li className="min-h-10">
      <div className="flex-col flex">
        <div className="flex-1 font-bold">
          <div className="flex">
            <span className="text-left w-1/2">
              {product.quantity} <small>x</small> {product.item.name}
            </span>
            <span className="text-right w-1/2">
              {product.totalPrice.toFixed(2)} €
            </span>
          </div>
        </div>
        <span className="flex-1 text-gray-700">
          {product.optionAnswers.join()}
        </span>
        {product.extra_ingredientes && (
          <ul>
            {product.extra_ingredientes.map((i, idx) => (
              <li key={idx} className="text-gray-700">
                <small>+</small> {i}
              </li>
            ))}
          </ul>
        )}
        <span className="flex-1 text-gray-700">{product.comment}</span>
      </div>
    </li>
  );
};
