import React, { Component } from "react";
import { connect } from "react-redux";
import "../../../css/Pages/orderpage.css";
import PropTypes from "prop-types";
import { Redirect } from "react-router";
import { update_cart } from "../../../actions/orders";
import AddIcon from "@material-ui/icons/Add";
import MenuIcon from "@material-ui/icons/Menu";
import RemoveIcon from "@material-ui/icons/Remove";
import ClearIcon from "@material-ui/icons/Clear";
import { showInfoSnackbar } from "../../../actions/snackbar";
// import AlertModal from "../../MainPanel/Pages/Alert/AlertModal";

import { CircularProgress } from "@material-ui/core";

import { auth_get_request } from "../../../actions/lib";
import {
  GET_CATEGORIES,
  GET_CHOICES,
  GET_INGREDIENTS,
  GET_ITEMS,
} from "../../../actions/actions";
import { Link } from "react-router-dom";

import Header1 from "../../Layout/Header1";
import OrderItemModal1 from "../../Modals/OrderItemModal1";

var _ = require("lodash");

class ShopPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      totalPrice: 0,
      grouped: [],
      selectedCategory: "1",
      selectedItem: {},
      itemToUpdate: {},
      showModal: false,
      modalToUpdate: false,
      indexToUpdate: 0,
      pathToImages: "",
      showAlert: false,
      alertMessage: "",
      continueOrder: false,
      searchParam: "",
      products: [],
      categories: [],
      isReady: false,
    };
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
    this.showModal = this.showModal.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  static propTypes = {
    orderReducer: PropTypes.object.isRequired,
    userReducer: PropTypes.object.isRequired,
    products: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    isReady: PropTypes.bool.isRequired,
    update_cart: PropTypes.func.isRequired,
    showInfoSnackbar: PropTypes.func.isRequired,
    auth_get_request: PropTypes.func.isRequired,
  };

  changeCategory = (category, drawer) => {
    this.setState({ selectedCategory: category });
  };

  continueOrder = () => {
    if (this.state.cart.length > 0) {
      if (localStorage.getItem("isAuthenticated") !== "true") {
        // this.showAlert(true, "You have to login first!");
        this.props.showInfoSnackbar("You have to login first!");
      } else {
        this.setState({
          continueOrder: true,
        });
      }
    } else {
      // return <Alert variant="secondary">Your card is empty!</Alert>;
      this.props.showInfoSnackbar("Your cart is empty!");
    }
  };

  updateCart = (item, quantity, index) => {
    // console.log(item, quantity);
    const order_item = {
      item: item.item,
      options: item.options,
      comment: item.comment,
      totalPrice: item.item.price * quantity + item.extraPrice * quantity,
      optionAnswers: item.optionAnswers,
      extra_ingredients: item.extra_ingredients,
      quantity: quantity,
    };
    let cart_ = this.state.cart;
    let oldTotalPrice = this.state.totalPrice;
    let newTotalPrice =
      oldTotalPrice - cart_[index].totalPrice + order_item.totalPrice;
    cart_[index] = order_item;
    this.setState({
      cart: cart_,
      totalPrice: newTotalPrice,
    });
    // this.props.update_order(this.state.cart, this.state.totalPrice);
  };

  addToCart = (item, quantity) => {
    const order_item = {
      item: item.item,
      options: item.options,
      comment: item.comment,
      extraPrice: item.extraPrice,
      totalPrice: item.item.price * quantity + item.extraPrice * quantity,
      optionAnswers: item.optionAnswers,
      extra_ingredients: item.extra_ingredients,
      quantity: quantity,
    };
    this.setState({
      cart: [...this.state.cart, order_item],
      totalPrice: this.state.totalPrice + order_item.totalPrice,
    });
    // this.props.update_order(this.state.cart, this.state.totalPrice);
  };

  removeFromCart = (index, order_item) => {
    // console.log(order_item);
    this.setState({
      cart: [...this.state.cart.filter((item, idex) => idex !== index)],
      totalPrice: this.state.totalPrice - order_item.totalPrice,
    });
    // this.props.update_order(this.state.cart, this.state.totalPrice);
  };

  clearCart() {
    this.setState({ cart: [], totalPrice: 0 });
    // this.props.update_order(this.state.cart, this.state.totalPrice);
  }

  showModal = (item, bool, close, index) => {
    let item_ = {};
    let cat_ = "";
    if (bool) {
      item_ = item.item;
    } else {
      item_ = item;
    }
    if (close) {
      cat_ = this.state.selectedCategory;
    } else {
      cat_ = item_.category_id;
    }
    this.setState({
      selectedItem: item_,
      selectedCategory: cat_,
      showModal: !this.state.showModal,
      modalToUpdate: bool,
      indexToUpdate: index,
      itemToUpdate: item,
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  changeQuantity = (bool, index) => {
    let cur_cart = [...this.state.cart];
    let cur_item = cur_cart[index];
    let price_per_unit = cur_item.totalPrice / cur_item.quantity;
    let cartTotalPrice = this.state.totalPrice;

    if (bool) {
      cur_item.totalPrice += price_per_unit;
      cur_item.quantity += 1;
      cartTotalPrice += price_per_unit;
    } else {
      cur_item.totalPrice -= price_per_unit;
      cur_item.quantity -= 1;
      cartTotalPrice -= price_per_unit;
    }
    cur_cart[index] = cur_item;
    // console.log(cur_item);
    if (cur_item.quantity === 0) {
      cur_item.quantity += 1;
      cur_item.totalPrice += price_per_unit;
      this.removeFromCart(index, cur_item);
    } else {
      this.setState({
        cart: cur_cart,
        totalPrice: cartTotalPrice,
      });
    }
  };

  componentWillUnmount() {
    this.props.update_cart(this.state.cart, this.state.totalPrice);
  }
  showAlert = (bool, msg) => {
    this.setState({
      showAlert: bool,
      alertMessage: msg,
    });
  };

  showSearchResults = (e) => {
    let type = e.type;
    if (type === "click" || type === "keydown") {
      let name = e.target.textContent;
      if (type === "keydown") {
        name = e.target.value;
      }
      let product;
      let found = false;
      for (var i in this.props.products) {
        if (this.props.products[i].name === name) {
          product = this.props.products[i];
          found = true;
          break;
        }
      }
      if (found)
        this.setState({
          selectedCategory: product.category,
        });
    }
  };

  componentDidMount() {
    if (this.props.isReady === false) {
      this.get_items();
      this.get_choices();
      this.get_categories();
      this.get_ingredients();
    }
    if (this.props.orderReducer.products.length > 0) {
      let grouped = _.groupBy(this.props.products, "category");
      let category = this.props.categories[0].name;
      if (this.state.searchParam !== "") {
        for (var i in this.props.products) {
          if (this.props.products[i].name === this.state.searchParam) {
            category = this.props.products[i].categroy;
            break;
          }
        }
      }
      this.setState({
        selectedCategory: category,
        grouped: grouped,
        cart: this.props.orderReducer.products,
        totalPrice: this.props.orderReducer.totalPrice,
      });
    }
  }
  async get_items() {
    await this.props.auth_get_request("products/all", GET_ITEMS);
  }
  async get_categories() {
    await this.props.auth_get_request("product_category/all", GET_CATEGORIES);
  }
  async get_choices() {
    await this.props.auth_get_request("product_choices/all", GET_CHOICES);
  }
  async get_ingredients() {
    await this.props.auth_get_request("ingredients/all", GET_INGREDIENTS);
  }

  onSearchChange = (product) => {
    if (product) {
      this.changeCategory(product.category_id);
    }
  };

  render() {
    let modal;
    if (this.state.showModal) {
      modal = (
        <OrderItemModal1
          onClose={() =>
            this.showModal(this.state.selectedItem, false, true, 0)
          }
          show={this.state.showModal}
          item={this.state.selectedItem}
          update={this.state.modalToUpdate}
          updateItem={this.state.itemToUpdate}
          category={
            this.props.categories.filter(
              (cat) => cat.name === this.state.selectedCategory
            )[0]
          }
          onAdd={this.addToCart}
          onUpdate={this.updateCart}
          index={this.state.indexToUpdate}
        />
      );
    }
    if (this.state.continueOrder) {
      return <Redirect to={`/checkout/${sessionStorage.getItem("userID")}`} />;
    }
    if (!this.props.isReady) {
      return (
        <div className="loading-div">
          <CircularProgress disableShrink />{" "}
        </div>
      );
    } else {
      return (
        <div className="flex">
          <div className="w-1/12 flex-none"></div>
          <div className="flex-grow ">
            <Header1 />
            {modal}
            <div className="w-full md:inline-flex lg:inline-flex sm:grid text-center ">
              {/* Left column */}
              <div className="flex-none w-1/6 ">
                <CategoryMenu
                  categories={this.props.categories}
                  onChange={(category) => this.changeCategory(category, false)}
                  selectedCategory={this.state.selectedCategory}
                />
              </div>
              {/* Center column */}
              <div className="flex-none w-4/6">
                <SearchBar
                  onChange={this.onChange}
                  searchTerm={this.state.searchParam}
                  onSelect={this.onSearchChange}
                />
                <ItemsList
                  products={this.props.products}
                  selectedCategory={this.state.selectedCategory}
                  showModal={(item, bool, bool1, idx) =>
                    this.showModal(item, bool, bool1, idx)
                  }
                />
              </div>
              {/* Right column */}
              <div className="flex-none w-1/6">
                <Cart />
              </div>
            </div>
          </div>
          <div className="w-1/12 flex-none"></div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  orderReducer: state.orderReducer,
  products: state.productReducer.products,
  categories: state.productReducer.categories,
  userReducer: state.userReducer,
  isReady: state.productReducer.isReady,
});

export default connect(mapStateToProps, {
  update_cart,
  showInfoSnackbar,
  auth_get_request,
})(ShopPage);

const CategoryMenu = ({ categories, onChange, selectedCategory }) => {
  return (
    <div class="w-full bg-white rounded-lg shadow-lg overflow-auto">
      <ul class="divide-y-2 divide-gray-100">
        {categories.map((c, idx) => (
          <Link
            // exact
            to={`/order1/${c.name}`}
            onClick={() => onChange(c.name)}
            className={`block w-full   text-black-200 hover:text-gray-400 transition duration-150 inline-block`}
            key={idx}
          >
            <li
              className={`px-2 py-2 text-center rounded-sm mb-0.5 last:mb-0 hover:bg-gray-600 ${
                selectedCategory === c.name && "bg-blue-300"
              } `}
            >
              <div className=" text-center flex-grow">
                <span className="text-m font-medium">{c.name}</span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

const Cart = ({ categories, onChange, selectedCategory }) => {
  return <div>menu</div>;
};

const SearchBar = ({ searchTerm, onChange, onSelect }) => {
  return (
    <div class="flex items-center ">
      <div className="w-1/6"></div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6  text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        name="searchParam"
        placeholder="name"
        onChange={onChange}
        value={searchTerm}
        class="w-2/3 py-2 border-b-2 border-blue-400 outline-none focus:border-green-400"
      />
      <div className="w-1/6"></div>
    </div>
  );
};
const ItemsList = ({ products, selectedCategory, showModal }) => {
  return (
    <div className="flex item-center mt-2">
      <div className="w-1/6"></div>
      <div class=" bg-white rounded-lg  w-4/6 shadow-lg overflow-auto ">
        <ul class="divide-y-2 divide-gray-100">
          {products.map((p) => (
            <ItemComponent
              item={p}
              showModal={(item, bool, bool1, idx) =>
                showModal(item, bool, bool1, idx)
              }
            />
          ))}
        </ul>
        <div className="w-1/6"></div>
      </div>
    </div>
  );
};

const ItemComponent = ({ item, showModal }) => {
  let disabled = false;
  if (item.available === false) {
    disabled = true;
  }
  return (
    <li
      class="p-3 hover:bg-blue-600 hover:text-blue-200"
      onClick={() =>
        disabled === false ? showModal(item, false, false, 0) : null
      }
    >
      <div
        className={`grid grid-cols-2 h-16 ${disabled && "opacity-50"}`}
        aria-disabled={disabled}
      >
        <div className="text-left">
          <span className={`text-lg ${disabled ? "line-through" : ""}`}>
            {item.name}
          </span>
          <span className="text-gray-400">
            <br />
            {item.description}
          </span>
          <span>
            <br />
            {item.price.toFixed(2)} €
          </span>
        </div>
        <div className="text-right">
          <img
            src={`http://localhost:8080/assets/images/${item.image}`}
            alt="item-imag"
          />
        </div>
      </div>
    </li>
  );
};
