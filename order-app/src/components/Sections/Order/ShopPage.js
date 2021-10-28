/* eslint-disable no-restricted-globals */
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router";
import { update_cart } from "../../../actions/orders";
import { showInfoSnackbar } from "../../../actions/snackbar";
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
      redirect: false,
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
    localStorage.setItem("cart", JSON.stringify(cart_));
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
    localStorage.setItem(
      "cart",
      JSON.stringify([...this.state.cart, order_item])
    );
    this.setState({
      cart: [...this.state.cart, order_item],
      totalPrice: this.state.totalPrice + order_item.totalPrice,
    });

    // this.props.update_order(this.state.cart, this.state.totalPrice);
  };

  removeFromCart = (index, order_item) => {
    if (confirm("Διαγραφή προϊόντoς?") === true) {
      localStorage.setItem(
        "cart",
        JSON.stringify([
          ...this.state.cart.filter((item, idex) => idex !== index),
        ])
      );
      this.setState({
        cart: [...this.state.cart.filter((item, idex) => idex !== index)],
        totalPrice: this.state.totalPrice - order_item.totalPrice,
      });
    } else {
      return;
    }
    // this.props.update_order(this.state.cart, this.state.totalPrice);
  };

  clearCart() {
    if (confirm("Άδειασμα καλαθιού?") === true) {
      localStorage.setItem("cart", JSON.stringify([]));
      this.setState({ cart: [], totalPrice: 0 });
    } else {
      return;
    }
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
      localStorage.setItem("cart", JSON.stringify(cur_cart));
      this.setState({
        cart: cur_cart,
        totalPrice: cartTotalPrice,
      });
    }
  };

  componentWillUnmount() {
    this.props.update_cart(this.state.cart, this.state.totalPrice);
    localStorage.setItem("cart", JSON.stringify(this.state.cart));
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
    if (this.props.products.length > 0) {
      let grouped = _.groupBy(this.props.products, "category");
      this.setState({
        grouped: grouped,
        cart: this.props.orderReducer.products,
        totalPrice: this.props.orderReducer.totalPrice,
      });
    }

    if (!!this.props.match.params.category_name === true) {
      this.setState({
        param: this.props.match.params.category_name,
      });
    }
    let cart = localStorage.getItem("cart");
    if (cart) {
      let c = JSON.parse(cart);
      let totalPrice = 0;
      c.forEach((i) => (totalPrice += i.totalPrice));
      this.setState({
        cart: JSON.parse(cart),
        totalPrice: totalPrice,
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
      return <Redirect to={`/checkout1/${sessionStorage.getItem("userID")}`} />;
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
              <div className="flex-none lg:w-2/12 md:w-full sm:w-full">
                <CategoryMenu
                  categories={this.props.categories}
                  onChange={(category) => this.changeCategory(category, false)}
                  selectedCategory={this.state.selectedCategory}
                />
              </div>
              {/* Center column */}
              <div className="flex-none lg:w-7/12 w-full">
                {/* <SearchBar
                  onChange={this.onChange}
                  searchTerm={this.state.searchParam}
                  onSelect={this.onSearchChange}
                /> */}
                <ItemsList
                  products={this.props.products}
                  selectedCategory={this.state.selectedCategory}
                  showModal={(item, bool, bool1, idx) =>
                    this.showModal(item, bool, bool1, idx)
                  }
                />
              </div>
              {/* Right column */}
              <div className="flex-none lg:w-3/12 w-full mt-4">
                <Cart
                  cart={this.state.cart}
                  changeQuantity={(bool, index) =>
                    this.changeQuantity(bool, index)
                  }
                  removeFromCart={(index, item) =>
                    this.removeFromCart(index, item)
                  }
                  totalPrice={this.state.totalPrice}
                  continueOrder={this.continueOrder}
                  clearCart={this.clearCart}
                  showModal={(item, bool, bool1, index) =>
                    this.showModal(item, bool, bool1, index)
                  }
                />
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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-auto  ">
      <div className=" divide-y-2 divide-gray-100 hidden md:flex md:flex-col">
        {categories.map((c, idx) => (
          <Link
            // exact
            to={`/order1/${c.name}`}
            onClick={() => onChange(c.ID)}
            className={`block w-full text-black-200 hover:text-gray-400 transition duration-150 inline-block`}
            key={idx}
          >
            <li
              className={`px-2 py-2 list-none  text-center rounded-sm mb-0.5 last:mb-0 hover:bg-gray-600 ${
                selectedCategory === c.name && "bg-blue-300"
              } `}
            >
              <div className=" text-center flex-grow">
                <span className="text-m font-medium">{c.name}</span>
              </div>
            </li>
          </Link>
        ))}
      </div>
      <div className="flex lg:hidden items-center space-x-4 overflow-y-auto md:max-w-lg xl:max-w-5xl 2xl:max-w-7xl lg:max-w-3xl whitespace-nowrap">
        {categories.map((c, idx) => (
          <Link
            // exact
            to={`/order1/${c.name}`}
            onClick={() => onChange(c.ID)}
            className={`block w-full text-black-200 hover:text-gray-400 transition duration-150 inline-block`}
            key={idx}
          >
            <li
              className={`px-2 py-2 list-none  text-center rounded-sm mb-0.5 last:mb-0 hover:bg-gray-600 ${
                selectedCategory === c.name && "bg-blue-300"
              } `}
            >
              <div className=" text-center flex-grow">
                <span className="text-m font-medium">{c.name}</span>
              </div>
            </li>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Cart = ({
  cart,
  showModal,
  changeQuantity,
  removeFromCart,
  continueOrder,
  clearCart,
  totalPrice,
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-auto">
      <div className=" w-full  rounded-b border-t-0 z-10">
        {cart.map((i, indx) => {
          return (
            <div
              key={indx}
              className="p-2 flex bg-white hover:bg-gray-100 cursor-pointer border-b border-gray-100"
            >
              <div className="p-2 w-2/12">
                <img
                  src="https://dummyimage.com/50x50/bababa/0011ff&amp;text=50x50"
                  alt="img product"
                />
              </div>
              <div
                className="flex-auto text-sm w-6/12"
                onClick={() => showModal(i, true, false, indx)}
              >
                <div className="font-bold">{i.item.name}</div>
                <div className="truncate">{i.item.description}</div>
                <div className="text-gray-400">Ποσότητα: {i.quantity}</div>
                <div className="text-gray-400 text-left">
                  {i.optionAnswers.length > 0 && (
                    <span>{i.optionAnswers.join()}</span>
                  )}
                </div>
                <div className="text-gray-400">
                  {i.extra_ingredients.length > 0 && (
                    <ul>
                      {i.extra_ingredients.map((ing, indx) => (
                        <li className="text-left" key={indx}>
                          + {ing}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="text-gray-400 text-left">
                  {i.comment && <span>{i.comment}</span>}
                </div>
              </div>
              <div className="flex flex-col w-4/12 font-medium items-end">
                <div
                  onClick={() => removeFromCart(indx, i)}
                  className="w-4 h-4 mb-6 hover:bg-red-200 rounded-full cursor-pointer text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-trash-2 "
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </div>
                <div className="flex">
                  <button
                    onClick={() => changeQuantity(false, indx)}
                    className="w-7 h-7 mx-2 hover:bg-blue-200 rounded-lg cursor-pointer text-white bg-blue-500 "
                  >
                    -
                  </button>
                  <button
                    onClick={() => changeQuantity(true, indx)}
                    className="w-7 h-7 mx-2  hover:bg-gray-400 rounded-lg cursor-pointer text-white bg-gray-600 "
                  >
                    +
                  </button>
                </div>
                <div>
                  <span>
                    {i.quantity} x {(i.totalPrice / i.quantity).toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="p-4 justify-center flex">
          <button
            onClick={continueOrder}
            className="text-base   hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
        hover:bg-teal-700 hover:text-teal-100 
        bg-teal-100 
        text-teal-700 
        border duration-200 ease-in-out 
        border-teal-600 transition"
          >
            Συνέχεια {totalPrice.toFixed(2)} €
          </button>
        </div>
        <button
          onClick={clearCart}
          className="text-gray-400 hover:text-gray-600 hover:underline focus:outline-none"
        >
          Άδειασμα
        </button>
      </div>
    </div>
  );
};

// const SearchBar = ({ searchTerm, onChange, onSelect }) => {
//   return (
//     <div className=" items-center hidden lg:flex">
//       <div className="w-1/6"></div>
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-6 h-6  text-blue-600"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//         />
//       </svg>
//       <input
//         type="text"
//         name="searchParam"
//         placeholder="name"
//         onChange={onChange}
//         value={searchTerm}
//         className="w-2/3 py-2 border-b-2 border-blue-400 outline-none focus:border-green-400"
//       />
//       <div className="w-1/6"></div>
//     </div>
//   );
// };
const ItemsList = ({ products, selectedCategory, showModal }) => {
  let items = products.filter((p) => p.category_id === selectedCategory);
  return (
    <div className="flex item-center mt-2">
      <div className="hidden lg:flex lg:w-1/6"></div>
      <div className=" bg-white rounded-lg w-full  lg:w-4/6 shadow-lg overflow-auto ">
        <ul className="divide-y-2 divide-gray-100">
          {items.map((p, idx) => (
            <ItemComponent
              key={idx}
              item={p}
              showModal={(item, bool, bool1, idx) =>
                showModal(item, bool, bool1, idx)
              }
            />
          ))}
        </ul>
        <div className="hidden lg:flex lg:w-1/6"></div>
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
      className="p-3 hover:bg-blue-600 hover:text-blue-200"
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
