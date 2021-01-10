import axios from "axios";
import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { headers } from "../../../../utils/axiosHeaders";

class CreateItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: 0,
      category: "",
      description: "",
      image: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const item = {
      name: this.state.name,
      description: this.state.description,
      price: parseFloat(this.state.price),
      category: this.state.category,
    };
    console.log(item);
    axios
      .post("http://localhost:8080/products/create_product", item, headers)
      .then((response) => console.log(response))
      .catch((error) => console.log(error))
      .then(
        this.setState({
          name: "",
          price: 0,
          category: "",
          description: "",
        })
      );
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            type="text"
            placehodler="Enter name"
            name="name"
            onChange={this.onChange}
          />
          <Form.Text>Item Name</Form.Text>
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Item description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter desc"
            name="description"
            onChange={this.onChange}
          />
          <Form.Text>Item description</Form.Text>
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Item price</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            autoComplete="false"
            placeholder="Enter price"
            name="price"
            onChange={this.onChange}
          />
          <Form.Text>Item price</Form.Text>
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control as="select" name="category" onChange={this.onChange}>
            {this.props.categories.map((category, index) => {
              return <option key={index}>{category.name}</option>;
            })}
            <option key="2">None</option>
          </Form.Control>
          <Form.Text>Category</Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

export default CreateItemForm;
