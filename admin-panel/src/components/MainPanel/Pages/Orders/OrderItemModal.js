import React, { Component } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import "../../../../css/Pages/orderpage.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";

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
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };

  componentDidMount() {
    if (this.props.update) {
      console.log(this.props);
      this.setState({
        options: this.props.updateItem.options,
        quantity: this.props.updateItem.quantity,
        comment: this.props.updateItem.comment,
        extraPrice:
          this.props.updateItem.totalPrice / this.props.updateItem.quantity -
          this.props.updateItem.item.price,
      });
    }
  }

  componentWillUnmount() {
    // console.log("im leaving");
  }

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
    };
    console.log(item);
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
        id="orderItemModal"
      >
        <Modal.Header className="modalHeader">
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
          <Container fluid>
            <Form>
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
                          let update_option = this.props.updateItem.options[i];
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
          </Container>
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
  isAuthenticated: state.isAuthenticated,
});

export default connect(mapStateToProps, {})(OrderItemModal);
