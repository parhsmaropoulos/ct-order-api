import { Checkbox, List, ListItem, ListItemText } from "@material-ui/core";
import React, { Component } from "react";
import { Button, Form, Modal, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { create_choice } from "../../../actions/items";
import PropTypes from "prop-types";

class CreateChoiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      desctription: "",
      options: [],
      optionName: "",
      optionPrice: 0,
      show: false,
      multiple: false,
      required: false,
    };
    this.removeOption = this.removeOption.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSaveOption = this.handleSaveOption.bind(this);
    this.onSumbit = this.onSubmit.bind(this);
  }

  static propTypes = {
    create_choice: PropTypes.func.isRequired,
  };

  removeOption = (index) => {
    this.setState({
      options: this.state.options.filter((s, sindex) => sindex !== index),
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleShow = () => {
    console.log("open");
    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };

  handleSaveOption = () => {
    const option = {
      name: this.state.optionName,
      price: parseFloat(this.state.optionPrice),
    };
    this.setState((prevState) => ({
      options: [...prevState.options, option],
    }));
    this.setState({ show: false });
  };

  onSubmit(event) {
    event.preventDefault();

    const choice = {
      name: this.state.name,
      description: this.state.description,
      required: this.state.required,
      multiple: this.state.multiple,
      options: this.state.options,
    };
    console.log(choice);
    this.props.create_choice(choice);
  }

  render() {
    return (
      <div className="CreateChoiceForm">
        <Form onSubmit={this.onSumbit}>
          <Form.Group controlId="choiceName">
            <Form.Label>Choice Name</Form.Label>
            <Form.Control
              name="name"
              type="text"
              placeholder="Enter name"
              required
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group controlId="choiceDesc">
            <Form.Label>Choice Description</Form.Label>
            <Form.Control
              name="description"
              type="text"
              placeholder="Enter description"
              required
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group controlId="choiceMultiple">
            <Form.Label>Multiple</Form.Label>
            <Checkbox
              checked={this.state.multiple}
              onChange={(e) =>
                this.setState({ multiple: !this.state.multiple })
              }
              color="primary"
            />
          </Form.Group>
          <Form.Group controlId="choiceRequired">
            <Form.Label>Required</Form.Label>
            <Checkbox
              checked={this.state.required}
              onChange={(e) =>
                this.setState({ required: !this.state.required })
              }
              color="primary"
            />
          </Form.Group>
          <Form.Label>Choice Options</Form.Label>
          <Form.Group controlId="choiceOptions">
            <List dense>
              {this.state.options.map((opt, key) => {
                return (
                  <ListItem key={key}>
                    <ListItemText primary={`${opt.name} : ${opt.price}`} />{" "}
                    <Button onClick={() => this.removeOption(key)}>X</Button>
                  </ListItem>
                );
              })}
            </List>
          </Form.Group>
          <Form.Row>
            <Button variant="primary" onClick={this.handleShow}>
              Add option
            </Button>
            <Button variant="primary" type="submit">
              Save choice
            </Button>
          </Form.Row>
        </Form>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Option Values</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Row>
              <Form.Group as={Col} md={6}>
                <Form.Label>Value</Form.Label>
                <Form.Control
                  id="optionName"
                  name="optionName"
                  type="text"
                  placeholer="enter name"
                  onChange={this.onChange}
                ></Form.Control>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  id="optionPrice"
                  name="optionPrice"
                  type="number"
                  step="0.01"
                  placeholer="enter price"
                  onChange={this.onChange}
                ></Form.Control>
              </Form.Group>
            </Form.Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSaveOption}>
              Save Option
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default connect(null, { create_choice })(CreateChoiceForm);
