import React, { Component } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { connect } from "react-redux";
import "../../../../css/Pages/orderpage.css";
import OrderItemModal from "./OrderItemModal";
import PropTypes from "prop-types";
import { Redirect } from "react-router";
import { update_cart } from "../../../../actions/orders";
import { showInfoSnackbar } from "../../../../actions/snackbar";
import AlertModal from "../Alert/AlertModal";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, Typography } from "@material-ui/core";

var _ = require("lodash");

class OrderMainPage extends Component {
  constructor(props) {
    super(props);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
    this.showModal = this.showModal.bind(this);
    this.showAlert = this.showAlert.bind(this);
  }
  state = {
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
  };
  static propTypes = {
    orderReducer: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    products: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    isReady: PropTypes.bool.isRequired,
    update_cart: PropTypes.func.isRequired,
    showInfoSnackbar: PropTypes.func.isRequired,
  };
  changeCategory = (category) => {
    this.setState({ selectedCategory: category });
  };

  continueOrder = () => {
    if (this.state.cart.length > 0) {
      if (this.props.isAuthenticated === false) {
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
    console.log(item, quantity);
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
    console.log(order_item);
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
      cat_ = item_.category;
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
    console.log(cur_item);
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
    // console.log(this.props.products);
  }
  showAlert = (bool, msg) => {
    this.setState({
      showAlert: bool,
      alertMessage: msg,
    });
  };

  showSearchResults = (e) => {
    let type = e.type;
    // console.log(e.target.value);
    // console.log(e.target.textContent);
    if (type === "click" || type === "keydown") {
      let name = e.target.textContent;
      if (type === "keydown") {
        name = e.target.value;
      }
      // console.log(name);
      let product;
      let found = false;
      for (var i in this.props.products) {
        if (this.props.products[i].name === name) {
          product = this.props.products[i];
          found = true;
          break;
        }
      }
      // console.log(product);
      if (found)
        this.setState(
          {
            selectedCategory: product.category,
          },
          () => {
            console.log(this.state.selectedCategory);
          }
        );
    }
  };

  componentDidMount() {
    console.log(this.props.products);
    if (!this.props.isReady) {
      return <Redirect to="/home" />;
    }
    if (this.props.orderReducer.products.length > 0) {
      let grouped = _.groupBy(this.props.products, "category");
      this.setState({
        selectedCategory: this.props.categories[0].name,
        grouped: grouped,
        cart: this.props.orderReducer.products,
        totalPrice: this.props.orderReducer.totalPrice,
      });
    } else {
      let grouped = _.groupBy(this.props.products, "category");
      this.setState({
        selectedCategory: this.props.categories[0].name,
        grouped: grouped,
      });
    }
    // console.log(this.state);
  }

  render() {
    let modal;
    let alertModal;
    if (this.state.showAlert) {
      alertModal = (
        <AlertModal
          onClose={() => this.showAlert(false, "")}
          show={this.state.showAlert}
          message={this.state.alertMessage}
        />
      );
    }
    if (this.state.showModal) {
      modal = (
        <OrderItemModal
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
      return <Redirect to="/order/pre_complete" />;
    }
    if (!this.props.isReady) {
      return <Redirect to="/home" />;
    } else {
      return (
        <div id="orderMainPageContainer">
          {alertModal}
          <Row className="orderMainPageRow">
            <Col className="categoriesListCol">
              <div className="categoriesList">
                <ListGroup className="categoriesListGroup">
                  {this.props.categories.map((categ, index) => {
                    return (
                      <ListGroup.Item
                        key={index}
                        onClick={() => this.changeCategory(categ.name)}
                      >
                        {categ.name}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            </Col>
            <Col className="productList" xs={4} md={6}>
              <div className="search-bar-custom">
                {/* <SearchBar /> */}
                <Autocomplete
                  id="search-product"
                  options={this.props.products}
                  getOptionLabel={(option) => option.name}
                  disableClearable
                  autoComplete
                  onClose={(e) => this.showSearchResults(e)}
                  renderOption={(option, index) => (
                    <Typography
                      noWrap
                      onClick={(e) => console.log(e)}
                      key={index}
                    >
                      {option.name}
                    </Typography>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search product"
                      variant="outlined"
                      InputProps={{ ...params.InputProps, type: "search" }}
                    />
                  )}
                />
              </div>
              <ListGroup variant="flush">
                {this.props.products.map((item, index) => {
                  if (item.category === this.state.selectedCategory) {
                    if (item.available === false) {
                      return (
                        <ListGroup.Item key={index} disabled id={item.name}>
                          <Card border="light">
                            <Row className="itemCardRow">
                              {item.image === "" ? (
                                <Col sm={4} className="itemCardImageCol"></Col>
                              ) : (
                                <Col sm={4} className="itemCardImageCol">
                                  <Card.Img
                                    // src={`http:://localhost:8080/assets/images/${item.image}`}
                                    src={`http://localhost:8080/assets/images/${item.image}`}
                                    className="itemCardImage"
                                  ></Card.Img>{" "}
                                </Col>
                              )}
                              <Col sm={8}>
                                <Card.Body>
                                  <Card.Title className="item-unavailable">
                                    {item.name}
                                  </Card.Title>
                                  <Card.Subtitle className="text-muted">
                                    {/* {item.description} */}
                                    {item.ingredients &&
                                    item.ingredients.length > 0
                                      ? item.ingredients.join()
                                      : item.description}
                                  </Card.Subtitle>
                                  <Card.Text>{item.price} €</Card.Text>
                                </Card.Body>
                              </Col>
                            </Row>
                          </Card>
                        </ListGroup.Item>
                      );
                    } else {
                      return (
                        <ListGroup.Item
                          key={index}
                          onClick={() => this.showModal(item, false, false, 0)}
                          id={item.name}
                        >
                          <Card border="light">
                            <Row className="itemCardRow">
                              {item.image === "" ? (
                                <Col sm={4} className="itemCardImageCol"></Col>
                              ) : (
                                <Col sm={4} className="itemCardImageCol">
                                  <Card.Img
                                    src={`http://localhost:8080/assets/images/${item.image}`}
                                    className="itemCardImage"
                                  ></Card.Img>{" "}
                                </Col>
                              )}
                              <Col sm={8}>
                                <Card.Body>
                                  <Card.Title>{item.name}</Card.Title>
                                  <Card.Subtitle className="text-muted">
                                    {item.ingredients &&
                                    item.ingredients.length > 0
                                      ? item.ingredients.join()
                                      : item.description}
                                  </Card.Subtitle>
                                  <Card.Text>{item.price} €</Card.Text>
                                </Card.Body>
                              </Col>
                            </Row>
                          </Card>
                        </ListGroup.Item>
                      );
                    }
                  } else {
                    return <span key={index}></span>;
                  }
                })}
              </ListGroup>
            </Col>
            {modal}
            <Col className="cart">
              <div className="stickyCard">
                <Card>
                  <Card.Body className="cardBody">
                    <Card.Title>Το καλάθι σου</Card.Title>
                    <div className="cartList">
                      {this.state.cart.length > 0 ? (
                        <ListGroup>
                          {this.state.cart.map((order_item, index) => {
                            // console.log(order_item);
                            return (
                              <ListGroup.Item key={index} className="cardItem">
                                <Card border="light">
                                  <Card.Header
                                    style={{ backgroundColor: "white" }}
                                  >
                                    <Row className="headerItem">
                                      <div
                                        onClick={() =>
                                          this.showModal(
                                            order_item,
                                            true,
                                            false,
                                            index
                                          )
                                        }
                                        className="cartItemName"
                                      >
                                        {order_item.item.name}
                                      </div>
                                      <div className="cartItemPrice">
                                        {order_item.totalPrice /
                                          order_item.quantity}{" "}
                                        €
                                      </div>
                                    </Row>
                                  </Card.Header>
                                  <Card.Body>
                                    <Row className="bodyItem">
                                      {order_item.optionAnswers.length > 0 ? (
                                        <div className="cartItemOptions">
                                          <p>
                                            {order_item.optionAnswers.join() +
                                              `,${order_item.comment}`}
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="cartItemOptions">
                                          {order_item.comment}
                                        </div>
                                      )}
                                      <ul className="ingredientCartList">
                                        {order_item.extra_ingredients.length >
                                        0 ? (
                                          order_item.extra_ingredients.map(
                                            (ingredient, index) => {
                                              return (
                                                <li
                                                  key={index}
                                                  style={{ textAlign: "left" }}
                                                >
                                                  + {ingredient}
                                                </li>
                                              );
                                            }
                                          )
                                        ) : (
                                          <span></span>
                                        )}
                                      </ul>
                                    </Row>
                                  </Card.Body>
                                  <Card.Footer
                                    style={{ backgroundColor: "white" }}
                                  >
                                    <Row className="footerItem">
                                      <button
                                        // variant="outline-danger"
                                        className="minPlusButton"
                                        onClick={() =>
                                          this.changeQuantity(false, index)
                                        }
                                      >
                                        -
                                      </button>
                                      <p className="minPlusText">
                                        {order_item.quantity}
                                      </p>
                                      <button
                                        className="minPlusButton"
                                        onClick={() =>
                                          this.changeQuantity(true, index)
                                        }
                                      >
                                        +
                                      </button>
                                      <div className="removeButtonCol">
                                        <button
                                          className="removeButton minPlusButton"
                                          onClick={() =>
                                            this.removeFromCart(
                                              index,
                                              order_item
                                            )
                                          }
                                        >
                                          x
                                        </button>
                                      </div>
                                    </Row>
                                  </Card.Footer>
                                </Card>
                              </ListGroup.Item>
                            );
                          })}
                        </ListGroup>
                      ) : (
                        <Card.Text>Το καλάθι είναι άδειο</Card.Text>
                      )}
                    </div>
                    <hr />
                    <Row>
                      <Col>
                        <Card.Text>Σύνολο</Card.Text>
                      </Col>
                      <Col>
                        <Card.Text> {this.state.totalPrice} €</Card.Text>
                      </Col>
                    </Row>
                    <Button
                      variant="primary"
                      className="cartButton"
                      onClick={this.continueOrder}
                    >
                      Συνέχεια
                      {/* <Link to="pre_complete">Συνέχεια</Link> */}
                    </Button>
                    <br />
                    <Card.Text
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                      onClick={this.clearCart}
                    >
                      Άδειασμα
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
  orderReducer: state.orderReducer,
  products: state.productReducer.products,
  categories: state.productReducer.categories,
  isReady: state.productReducer.isReady,
});

export default connect(mapStateToProps, { update_cart, showInfoSnackbar })(
  OrderMainPage
);
