import React, { Component } from "react";
import { Card, Col, ListGroup, Row, ThemeProvider } from "react-bootstrap";
import { connect } from "react-redux";
import "../../../css/Pages/orderpage.css";
import OrderItemModal from "../../Modals/OrderItemModal";
import PropTypes from "prop-types";
import { Redirect } from "react-router";
import { update_cart } from "../../../actions/orders";
import AddIcon from "@material-ui/icons/Add";
import MenuIcon from "@material-ui/icons/Menu";
import RemoveIcon from "@material-ui/icons/Remove";
import {
  GetAsyncCategories,
  GetAsyncItems,
  get_items,
  get_categories,
  get_ingredients,
} from "../../../actions/items";
import ClearIcon from "@material-ui/icons/Clear";
import { showInfoSnackbar } from "../../../actions/snackbar";
// import AlertModal from "../../MainPanel/Pages/Alert/AlertModal";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Button,
  CircularProgress,
  Container,
  createMuiTheme,
  Drawer,
  Grid,
  Hidden,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { orange } from "@material-ui/core/colors";
// import { Link } from "react-router-dom";

var _ = require("lodash");

const customTheme = createMuiTheme({
  palette: {
    primary: {
      main: orange[500],
    },
  },
});

class OrderMainPage extends Component {
  constructor(props) {
    super(props);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
    this.showModal = this.showModal.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
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
    products: [],
    categories: [],
    isReady: false,
    openDrawer: false,
  };
  static propTypes = {
    orderReducer: PropTypes.object.isRequired,
    userReducer: PropTypes.object.isRequired,
    products: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    isReady: PropTypes.bool.isRequired,
    update_cart: PropTypes.func.isRequired,
    showInfoSnackbar: PropTypes.func.isRequired,
    GetAsyncCategories: PropTypes.func.isRequired,
    GetAsyncItems: PropTypes.func.isRequired,
    get_items: PropTypes.func.isRequired,
    get_categories: PropTypes.func.isRequired,
    get_ingredients: PropTypes.func.isRequired,
  };
  changeCategory = (category, drawer) => {
    this.setState({ selectedCategory: category });
    if (drawer) {
      this.setState({ openDrawer: false });
    }
  };

  continueOrder = () => {
    if (this.state.cart.length > 0) {
      if (sessionStorage.getItem("isAuthenticated") !== "true") {
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

  toggleDrawer = (bool) => {
    this.setState({ openDrawer: bool });
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
        this.setState(
          {
            selectedCategory: product.category,
          },
          () => {
            // console.log(this.state.selectedCategory);
          }
        );
    }
  };

  componentDidMount() {
    if (!this.props.isReady) {
      this.props.get_items();
      this.props.get_categories();
      this.props.get_ingredients();
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

  render() {
    let modal;
    let alertModal;
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
      return (
        <Redirect to={`/pre_complete/${sessionStorage.getItem("userID")}`} />
      );
    }
    if (!this.props.isReady) {
      return (
        <div className="loading-div">
          <CircularProgress disableShrink />{" "}
        </div>
      );
    } else {
      return (
        // <div id="orderMainPageContainer">
        <Container>
          <ThemeProvider theme={customTheme}>
            <Grid spacing={1} container style={{ minHeight: "70vh" }}>
              {alertModal}
              {/* <Row className="orderMainPageRow"> */}
              {/* ############## CATEGORIES ################## */}
              <Hidden smUp>
                <Grid item sm={2} xs={2} spacing={2}>
                  <Button
                    style={{
                      justifyContent: "left",
                    }}
                    className="menu-categories-list-button"
                    onClick={() => this.toggleDrawer(true)}
                  >
                    <MenuIcon />
                  </Button>
                  <Drawer
                    anchor={"left"}
                    open={this.state.openDrawer}
                    onClose={() => this.toggleDrawer(false)}
                  >
                    {this.props.categories.map((categ, index) => {
                      let selected = false;
                      if (this.state.selectedCategory === categ.name) {
                        selected = true;
                      }
                      return (
                        <ListGroup.Item
                          key={index}
                          onClick={() => this.changeCategory(categ.name, true)}
                          active={selected}
                        >
                          {categ.name}
                        </ListGroup.Item>
                      );
                    })}
                  </Drawer>
                </Grid>
              </Hidden>
              <Hidden mdDown>
                <Grid item lg={3} className="categoriesListCol">
                  <div className="categoriesList">
                    <ListGroup className="categoriesListGroup">
                      {this.props.categories.map((categ, index) => {
                        let selected = false;
                        if (this.state.selectedCategory === categ.name) {
                          selected = true;
                        }
                        return (
                          <ListGroup.Item
                            key={index}
                            onClick={() =>
                              this.changeCategory(categ.name, false)
                            }
                            active={selected}
                          >
                            {categ.name}
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </div>
                </Grid>
              </Hidden>
              {/* ################### PRODUCTS ############### */}
              <Grid
                item
                lg={6}
                md={12}
                sm={10}
                xs={10}
                style={{ width: "100%" }}
                className="productList"
              >
                {/* <SearchBar /> */}
                <Autocomplete
                  id="search-product"
                  options={this.props.products}
                  getOptionLabel={(option) => option.name}
                  // disableClearables={false}
                  autoComplete
                  onClose={(e) => this.showSearchResults(e)}
                  renderOption={(option, index) => (
                    <Typography
                      noWrap
                      // onClick={(e) => console.log(e)}
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
                <ListGroup variant="flush">
                  {this.props.products.map((item, index) => {
                    if (item.category === this.state.selectedCategory) {
                      if (item.available === false) {
                        return (
                          <ListGroup.Item key={index} disabled id={item.name}>
                            <Card border="light">
                              <Row className="itemCardRow">
                                {item.image === "" ? (
                                  <Col
                                    sm={4}
                                    className="itemCardImageCol"
                                  ></Col>
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
                            onClick={() =>
                              this.showModal(item, false, false, 0)
                            }
                            id={item.name}
                          >
                            <Card border="light">
                              <Row className="itemCardRow">
                                <Hidden mdDown>
                                  {item.image === "" ? (
                                    <Col
                                      sm={4}
                                      className="itemCardImageCol"
                                    ></Col>
                                  ) : (
                                    <Col sm={4} className="itemCardImageCol">
                                      <Card.Img
                                        src={`http://localhost:8080/assets/images/${item.image}`}
                                        className="itemCardImage"
                                      ></Card.Img>{" "}
                                    </Col>
                                  )}
                                </Hidden>
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
              </Grid>
              {modal}
              {/* ################### CART ############### */}
              <Grid
                item
                lg={3}
                md={12}
                sm={12}
                xs={12}
                style={{ width: "100%" }}
                className="cart"
              >
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
                                <ListGroup.Item
                                  key={index}
                                  className="cardItem"
                                >
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
                                                    style={{
                                                      textAlign: "left",
                                                    }}
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
                                      <Grid direction="row" container>
                                        <Grid item xs={9}>
                                          <IconButton
                                            className="minPlusButton"
                                            color="primary"
                                            variant="contained"
                                            aria-label="remove"
                                            onClick={() =>
                                              this.changeQuantity(false, index)
                                            }
                                          >
                                            <RemoveIcon fontSize="small" />
                                          </IconButton>
                                          <span>{order_item.quantity}</span>
                                          <IconButton
                                            className="minPlusButton"
                                            color="primary"
                                            variant="contained"
                                            aria-label="add"
                                            onClick={() =>
                                              this.changeQuantity(true, index)
                                            }
                                          >
                                            <AddIcon fontSize="small" />
                                          </IconButton>
                                        </Grid>
                                        <Grid item xs={3}>
                                          {/* <div className="removeButtonCol"> */}
                                          <IconButton
                                            className="removeButton minPlusButton"
                                            color="secondary"
                                            variant="contained"
                                            aria-label="remove"
                                            onClick={() =>
                                              this.removeFromCart(
                                                index,
                                                order_item
                                              )
                                            }
                                          >
                                            <ClearIcon fontSize="small" />
                                          </IconButton>
                                          {/* </div> */}
                                        </Grid>
                                      </Grid>
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
                        variant="contained"
                        color="primary"
                        className="cartButton"
                        onClick={this.continueOrder}
                      >
                        Συνέχεια
                        {/* <Link to="/order/pre_complete">Συνέχεια</Link> */}
                      </Button>
                      <br />
                      <Card.Text
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        onClick={this.clearCart}
                      >
                        Άδειασμα
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </Grid>
              {/* </Row> */}
              {/* </div> */}
            </Grid>
          </ThemeProvider>
        </Container>
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
  GetAsyncItems,
  GetAsyncCategories,
  get_items,
  get_ingredients,
  get_categories,
})(OrderMainPage);
