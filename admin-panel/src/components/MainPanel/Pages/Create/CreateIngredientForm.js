import axios from "axios";
import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { headers } from "../../../../utils/axiosHeaders";

class CreateIngredientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: 0,
      description: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {}

  onSubmit(event) {
    event.preventDefault();
    const ingredient = {
      name: this.state.name,
      price: parseFloat(this.state.price),
      description: this.state.description,
    };
    axios
      .post(
        "http://localhost:8080/products/create_product_ingredient",
        ingredient,
        headers
      )
      .then((res) => console.log(res));
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Ingredient Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            onChange={this.onChange}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Ingredient description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter description"
            name="description"
            onChange={this.onChange}
          />
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Ingredient price</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            autoComplete="false"
            placeholder="Enter price"
            name="price"
            onChange={this.onChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

export default CreateIngredientForm;
