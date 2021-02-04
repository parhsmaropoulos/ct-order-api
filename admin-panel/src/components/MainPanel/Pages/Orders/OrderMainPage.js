import React, { Component } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { connect } from "react-redux";
import "../../../../css/Pages/orderpage.css";
import Sticky from "react-stickynode";
import OrderItemModal from "./OrderItemModal";

var _ = require("lodash");

const items = [
  {
    id: 1,
    name: "item1",
    description: "item1 description",
    price: 10,
    category: "1",
  },
  {
    id: 2,
    name: "item2",
    description: "item2 description",
    price: 10,
    category: "2",
  },
  {
    id: 3,
    name: "item3",
    description: "item3 description",
    price: 10,
    category: "3",
  },
  {
    id: 4,
    name: "item4",
    description: "item4 description",
    price: 10,
    category: "1",
  },
  {
    id: 5,
    name: "item5",
    description: "item5 description",
    price: 10,
    category: "2",
  },
];

const categories = [
  {
    name: "1",
  },
  {
    name: "2",
  },
  {
    name: "3",
  },
  {
    name: "1",
  },
  {
    name: "2",
  },
  {
    name: "3",
  },
  {
    name: "1",
  },
  {
    name: "2",
  },
  {
    name: "3",
  },
  {
    name: "1",
  },
  {
    name: "2",
  },
  {
    name: "3",
  },
  {
    name: "1",
  },
  {
    name: "2",
  },
  {
    name: "3",
  },
];

class OrderMainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      totalPrice: 0,
      selectedCategory: "1",
      selectedItem: {},
      showModal: false,
    };
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  changeCategory = (category) => {
    this.setState({ selectedCategory: category });
  };

  addToCart = (item, quantity) => {
    const order_item = {
      item: item,
      quantity: quantity,
    };
    this.setState({
      cart: [...this.state.cart, order_item],
      totalPrice: this.state.totalPrice + item.price * quantity,
    });
  };

  removeFromCart = (index, order_item) => {
    console.log(order_item);
    this.setState({
      cart: [...this.state.cart.filter((item, idex) => idex !== index)],
      totalPrice:
        this.state.totalPrice - order_item.item.price * order_item.quantity,
    });
  };

  clearCart() {
    this.setState({ cart: [], totalPrice: 0 });
  }

  showModal = (item) => {
    this.setState({
      selectedItem: item,
      showModal: !this.state.showModal,
    });
  };

  componentDidMount() {
    let grouped = _.groupBy(items, "category");
    console.log(grouped);
  }

  render() {
    console.log(this.state.cart.length);
    return (
      <div id="orderMainPageContainer">
        <Row className="orderMainPageRow">
          <Col className="categoriesListCol">
            {/* <Sticky
              enabled={true}
              activeClass="categoriesListStickyActivated"
              className="categoriesListSticky"
            > */}
            <div className="categoriesList">
              <ListGroup className="categoriesListGroup">
                {categories.map((categ) => {
                  return (
                    <ListGroup.Item
                      onClick={() => this.changeCategory(categ.name)}
                    >
                      {categ.name}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </div>
            {/* </Sticky> */}
          </Col>
          <Col className="productList" xs={4} md={6}>
            <ListGroup variant="flush">
              {items.map((item, index) => {
                if (item.category === this.state.selectedCategory) {
                  return (
                    <ListGroup.Item
                      // onClick={() => this.addToCart(item)}
                      onClick={() => this.showModal(item)}
                      key={index}
                    >
                      <Card border="light">
                        <Row className="itemCardRow">
                          <Col sm={3} className="itemCardImageCol">
                            <Card.Img
                              src="/"
                              className="itemCardImage"
                            ></Card.Img>{" "}
                          </Col>
                          <Col sm={9}>
                            <Card.Body>
                              <Card.Title>{item.name}</Card.Title>
                              <Card.Subtitle className="text-muted">
                                {item.description}
                              </Card.Subtitle>
                              <Card.Text>{item.price}</Card.Text>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    </ListGroup.Item>
                  );
                }
              })}
            </ListGroup>
          </Col>
          <OrderItemModal
            onClose={this.showModal}
            show={this.state.showModal}
            item={this.state.selectedItem}
            onAdd={this.addToCart}
          />
          <Col className="cart">
            <div className="stickyCard">
              <Card>
                <Card.Body>
                  <Card.Title>Το καλάθι σου</Card.Title>
                  <Card.Text className="cartList">
                    {this.state.cart.length > 0 ? (
                      <ListGroup>
                        {this.state.cart.map((order_item, index) => {
                          return (
                            <ListGroup.Item
                              key={index}
                              onClick={() =>
                                this.removeFromCart(index, order_item)
                              }
                            >
                              <Card border="light">
                                <Row>
                                  <Col sm={9}>
                                    <Card.Body>
                                      <Card.Title>
                                        {order_item.item.name}
                                      </Card.Title>
                                      <Card.Subtitle className="text-muted">
                                        {order_item.item.description}
                                      </Card.Subtitle>
                                      <Card.Text>
                                        {order_item.item.price}
                                      </Card.Text>
                                    </Card.Body>
                                  </Col>
                                  <Col sm={3}>
                                    <Card.Text>{order_item.quantity}</Card.Text>
                                  </Col>
                                </Row>
                              </Card>
                            </ListGroup.Item>
                          );
                        })}
                      </ListGroup>
                    ) : (
                      <Card.Text>Το καλάθι είναι άδειο</Card.Text>
                    )}
                  </Card.Text>
                  <hr />
                  <Row>
                    <Col>
                      <div>
                        <p>Σύνολο</p>
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <p> {this.state.totalPrice}</p>
                      </div>
                    </Col>
                  </Row>
                  <Button variant="primary" className="cartButton">
                    Συνέχεια
                  </Button>
                  <br />
                  <p
                    style={{ textDecoration: "underline" }}
                    onClick={this.clearCart}
                  >
                    Άδειασμα
                  </p>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect()(OrderMainPage);
