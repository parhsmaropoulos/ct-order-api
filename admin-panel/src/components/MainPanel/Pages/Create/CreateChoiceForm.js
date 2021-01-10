import React, { Component } from "react";
import { Button, Form, Modal, Col } from "react-bootstrap";

class CreateChoiceForm extends Component {
  state = {
    name: "",
    desctription: "",
    options: [],
    optionName: "",
    optionPrice: 0,
    show: false,
  };

  componentDidMount() {
    if (this.props.choice !== null) {
      this.setState({
        name: this.props.choice.name,
        desctription: this.props.choice.desctription,
        options: this.props.choice.options,
      });
    }
  }

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
      price: this.state.optionPrice,
    };
    this.setState((prevState) => ({
      options: [...prevState.options, option],
    }));
    this.setState({ show: false });
  };

  render() {
    return (
      <div className="CreateChoiceForm">
        <Form>
          <Form.Group controlId="choiceName">
            <Form.Label>Choice Name</Form.Label>
            <Form.Control
              name="name"
              type="text"
              placeholder="Enter name"
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="choiceDesc">
            <Form.Label>Choice Description</Form.Label>
            <Form.Control
              name="description"
              type="text"
              placeholder="Enter description"
            ></Form.Control>
          </Form.Group>
          <Form.Label>Choice Options</Form.Label>
          <Form.Group controlId="choiceOptions">
            {this.state.options.map((opt, key) => {
              {
                console.log(opt);
                return (
                  <Form.Group>
                    <Form.Label key={key}>
                      {opt.name} : {opt.price}
                    </Form.Label>
                    <Button onClick={() => this.removeOption(key)}>X</Button>
                  </Form.Group>
                );
              }
            })}
          </Form.Group>
          <Form.Row>
            <Button variant="primary" onClick={this.handleShow}>
              Add option
            </Button>
            <Button
              variant="primary"
              onClick={() => this.props.add(this.state)}
            >
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

export default CreateChoiceForm;
