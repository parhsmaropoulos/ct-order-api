import React, { Component } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import "../../../../css/Pages/orderpage.css";
import "../../../../css/Layout/general.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";

class OrderItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // options: {},
      options: [],
      quantity: 1,
      comment: "",
      extraPrice: 0,
      item: {},
      extra_ingredients: [""],
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    ingredients: PropTypes.array.isRequired,
  };

  componentDidMount() {
    if (this.props.update) {
      console.log(this.props);
      this.setState({
        options: this.props.updateItem.options,
        quantity: this.props.updateItem.quantity,
        comment: this.props.updateItem.comment,
        extra_ingredients: this.props.updateItem.extra_ingredients,
        extraPrice:
          this.props.updateItem.totalPrice / this.props.updateItem.quantity -
          this.props.updateItem.item.price,
      });
    }
  }

  componentWillUnmount() {
    // console.log("im leaving");
  }

  handleToggle = (ingredient) => {
    const currentIndex = this.state.extra_ingredients.indexOf(ingredient.name);
    const newChecked = [...this.state.extra_ingredients];
    let newPrice = this.state.extraPrice;

    console.log(ingredient.name);
    if (currentIndex === -1) {
      newChecked.push(ingredient.name);
      newPrice += ingredient.price;
    } else {
      newChecked.splice(currentIndex, 1);
      newPrice -= ingredient.price;
    }

    this.setState({
      extra_ingredients: newChecked,
      extraPrice: newPrice,
    });
  };

  onSubmit(e) {
    e.preventDefault();
  }

  onAdd(e) {
    e.preventDefault();
    let optionAnswers = [];
    if (this.state.options.length > 0) {
      for (var i in this.state.options) {
        // console.log(i);
        optionAnswers.push(this.state.options[i].choice);
      }
    }
    const item = {
      item: this.props.item,
      options: this.state.options,
      comment: this.state.comment,
      extraPrice: this.state.extraPrice,
      optionAnswers: optionAnswers,
      extra_ingredients: this.state.extra_ingredients.slice(1),
    };
    if (this.props.update) {
      item.extra_ingredients = this.state.extra_ingredients;
    }
    // console.log(item);
    if (this.props.update) {
      this.props.onUpdate &&
        this.props.onUpdate(item, this.state.quantity, this.props.index);
    } else {
      this.props.onAdd && this.props.onAdd(item, this.state.quantity);
    }
    this.props.onClose && this.props.onClose(e);
    this.setState({
      options: {},
      quantity: 1,
      comment: "",
      extraPrice: 0,
      extraIngredients: [""],
    });
  }

  onChangeChoice = (choiceName, selectedOption) => {
    var currentOptions = this.state.options;
    let oldPrice = 0;
    let found = false;
    let exists = false;
    // console.log(choiceName);
    // console.log(selectedOption);
    // Check if choice has already changed once
    for (var id in currentOptions) {
      let old_option = currentOptions[id];
      if (old_option.name === choiceName) {
        if (old_option.choice === selectedOption.name) {
          exists = true;
        }
        oldPrice = old_option.price;
        old_option.choice = selectedOption.name;
        old_option.price = selectedOption.price;
        found = true;
        console.log("found");
      }
    }
    // Else it adds the option
    if (found === false && exists === false) {
      let newOption = {
        name: choiceName,
        choice: selectedOption.name,
        price: selectedOption.price,
      };
      currentOptions.push(newOption);
    }

    if (exists === false) {
      var newPrice = this.state.extraPrice + selectedOption.price - oldPrice;
      this.setState({
        options: currentOptions,
        extraPrice: newPrice,
      });
    }
    console.log(currentOptions);
  };

  onChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
    this.setState({
      options: {},
      quantity: 1,
      comment: "",
      extraPrice: 0,
    });
  };

  changeQuantity = (bool) => {
    if (bool) {
      this.setState({ quantity: this.state.quantity + 1 });
    } else if (this.state.quantity > 0) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };

  render() {
    let text = "";
    // console.log(this.props);
    if (!this.props.show) {
      return null;
    } else {
      if (this.props.update) {
        // console.log("here to update");
        text = "Ενημέρωση";
      } else {
        // console.log("here to add");
        text = "Προσθήκη";
      }
    }
    return (
      <Modal
        show={true}
        autoFocus={true}
        scrollable={true}
        onHide={(e) => {
          this.onClose(e);
        }}
        // id="orderItemModal"
        id="alertModal"
      >
        <Modal.Header className="alertModalHeader">
          <Container fluid>
            <Row>
              <Col className="modalHeaderTitle">
                {this.props.item.name}
                <br />
                {/* {this.props.item.description} */}
              </Col>
              <Col></Col>
              <Col className="closeButtonCol">
                {/* {item_.price} € */}
                {this.props.update
                  ? this.state.extraPrice + this.props.updateItem.item.price
                  : this.state.extraPrice + this.props.item.price}{" "}
                €
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    this.onClose(e);
                  }}
                >
                  X
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Header>
        <Modal.Body className="modalBody">
          {/* <Container fluid> */}
          <div className="alertModalMessageDiv">
            <Form>
              <Form.Group>
                {this.props.item.choices.map((choice, indx) => {
                  return (
                    <div key={indx}>
                      <p className="modalChoiceName">
                        {choice.name}
                        {choice.required ? <span>*</span> : <span></span>}
                      </p>
                      <div className="orderItemModalChoiceDiv" key={indx}>
                        {choice.options.map((option, index) => {
                          // if (this.props.update) {
                          let show = false;
                          for (var i in this.props.updateItem.options) {
                            let update_option = this.props.updateItem.options[
                              i
                            ];
                            if (
                              update_option.name === choice.name &&
                              update_option.choice === option.name
                            ) {
                              show = true;
                            }
                          }
                          if (this.props.update && show) {
                            return (
                              <div className="form-check" key={index}>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`${choice.name}`}
                                  value={`${option.name}`}
                                  id={`${option.name}${index}`}
                                  onClick={() =>
                                    this.onChangeChoice(choice.name, option)
                                  }
                                  defaultChecked
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`${option.name}${index}`}
                                >
                                  {option.name}
                                </label>
                                <span className="form-check-price">
                                  {option.price} €
                                </span>
                              </div>
                            );
                            // }
                          } else {
                            return (
                              <div className="form-check" key={index}>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`${choice.name}`}
                                  value={`${option.name}`}
                                  id={`${option.name}${index}`}
                                  onClick={() =>
                                    this.onChangeChoice(choice.name, option)
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`${option.name}${index}`}
                                >
                                  {option.name}
                                </label>
                                <span className="form-check-price">
                                  {option.price} €
                                </span>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  );
                })}
              </Form.Group>
              {this.props.item.custom === true ? (
                <Form.Group controlId="ingrdients">
                  <List
                    className="create-item-ingredient-list"
                    id="ingredient-list"
                  >
                    {this.props.ingredients.map((ingredientCategory, index) => {
                      return (
                        <div key={index}>
                          <p className="modalChoiceName">
                            {`${ingredientCategory[0].category}`}
                          </p>
                          <div
                            className="orderItemModalIngredientsDiv"
                            key={index}
                          >
                            {ingredientCategory.map((ingredient, index) => {
                              const labelId = `ingredient-item-${ingredient.name}`;
                              return (
                                <ListItem
                                  key={index}
                                  role={undefined}
                                  dense
                                  className="item-modal-ingredient-li"
                                  // style={{ maxWidth: "50%", minWidth: "50%" }}
                                  button
                                  onClick={() => this.handleToggle(ingredient)}
                                >
                                  <ListItemIcon style={{ width: "100%" }}>
                                    <Checkbox
                                      edge="start"
                                      checked={
                                        this.state.extra_ingredients.indexOf(
                                          ingredient.name
                                        ) !== -1
                                      }
                                      tabIndex={-1}
                                      disableRipple
                                      inputProps={{
                                        "aria-labelledby": labelId,
                                      }}
                                    />
                                    <ListItemText
                                      id={labelId}
                                      primary={
                                        <Typography
                                          type="body2"
                                          style={{
                                            color: "black",
                                            textAlgin: "center",
                                          }}
                                        >
                                          {ingredient.name}
                                        </Typography>
                                      }
                                    />
                                    <ListItemText
                                      id={labelId}
                                      primary={
                                        <Typography
                                          type="subtitle1"
                                          style={{
                                            color: "black",
                                            textAlign: "right",
                                          }}
                                        >
                                          {ingredient.price} €
                                        </Typography>
                                      }
                                    />
                                  </ListItemIcon>
                                </ListItem>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </List>
                </Form.Group>
              ) : (
                <span></span>
              )}
              <Form.Group>
                <Form.Label className="modalChoiceName">Comments</Form.Label>
                <Form.Control
                  as="textarea"
                  name="comment"
                  label="Leave a comment"
                  placeholder="Leave a comment"
                  value={this.state.comment}
                  onChange={this.onChange}
                />
              </Form.Group>
            </Form>
          </div>
          {/* </Container> */}
        </Modal.Body>
        <Modal.Footer id="modalFooter">
          <Row className="modalFooterRow">
            <Col>
              <Row>
                <button
                  // variant="outline-danger"
                  className="minPlusButton"
                  onClick={() => this.changeQuantity(false)}
                >
                  -
                </button>
                <p className="minPlusText">{this.state.quantity}</p>
                <button
                  // variant="outline-success"
                  className="minPlusButton"
                  onClick={() => this.changeQuantity(true)}
                >
                  +
                </button>
              </Row>
            </Col>
            <Col>
              <Button onClick={this.onAdd} className="modalFooterButton">
                {text}
              </Button>
            </Col>
            <Col></Col>
          </Row>
        </Modal.Footer>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
  ingredients: state.productReducer.ingredients,
});

export default connect(mapStateToProps, {})(OrderItemModal);
