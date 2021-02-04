import axios from "axios";
import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { headers } from "../../../../utils/axiosHeaders";
import PropTypes from "prop-types";
import { create_product } from "../../../../actions/items";

class CreateItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: 0,
      category: "",
      description: "",
      image: null,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    create_product: PropTypes.func.isRequired,
  };

  onSubmit(event) {
    event.preventDefault();
    const item = {
      name: this.state.name,
      description: this.state.description,
      price: parseFloat(this.state.price),
      category: this.state.category,
    };
    const image = this.state.image;
    console.log(item);
    this.props.create_product(item, image);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onFileChange = (e) => {
    console.log(e.target.files[0]);
    this.setState({
      image: e.target.files[0],
    });
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
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Item description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter desc"
            name="description"
            onChange={this.onChange}
          />
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
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control as="select" name="category" onChange={this.onChange}>
            {this.props.categories.length > 0 ? (
              this.props.categories.map((category, index) => {
                return <option key={index}>{category.name}</option>;
              })
            ) : (
              <option key="0">No categories yet</option>
            )}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="name">
          <Form.File
            id="custom-file"
            label="Custom file input"
            custom
            onChange={this.onFileChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
});
export default connect(mapStateToProps, { create_product })(CreateItemForm);
