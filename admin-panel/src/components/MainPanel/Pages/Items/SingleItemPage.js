import React, { Component } from "react";
import { connect } from "react-redux";
import {
  update_item,
  get_categories,
  delete_item,
} from "../../../../actions/items";
import PropTypes from "prop-types";
import { Button, Form } from "react-bootstrap";

class SingleItemPage extends Component {
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
    get_categories: PropTypes.func.isRequired,
    update_item: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
  };

  onSubmit(event) {
    event.preventDefault();
    const item = {
      name: this.state.name,
      description: this.state.description,
      price: parseFloat(this.state.price),
      category: this.state.category,
    };
    // Check if there is any change in the values
    if (this.state.name === "") {
      item.name = this.state.item.name;
    }
    if (this.state.description === "") {
      item.description = this.state.item.description;
    }
    if (this.state.price === 0) {
      item.price = this.state.item.price;
    }
    if (this.state.category === "") {
      item.category = this.state.item.category;
    }
    // TODO change image
    console.log(item);
    this.props.update_item(this.state.item.id, item, "update_product");
  }

  onDelete = () => {
    const id = this.state.item.id;
    const type = "product";
    this.props.delete_item(id, type);
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onFileChange = (e) => {
    console.log(e.target.files[0]);
    this.setState({
      image: e.target.files[0],
    });
  };

  state = {
    item: {},
  };

  componentWillMount() {
    this.props.get_categories();
    this.setState({ item: this.props.location.state.item });
  }
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            type="text"
            placehodler="Enter name"
            defaultValue={this.state.item.name}
            name="name"
            onChange={this.onChange}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Item description</Form.Label>
          <Form.Control
            type="text"
            defaultValue={this.state.item.description}
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
            defaultValue={this.state.item.price}
            autoComplete="false"
            placeholder="Enter price"
            name="price"
            onChange={this.onChange}
          />
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            name="category"
            defaultValue={this.state.item.category}
            onChange={this.onChange}
          >
            {this.props.categories.map((category, index) => {
              return <option key={index}>{category.name}</option>;
            })}
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
          Update
        </Button>
        <Button variant="danger" onClick={this.onDelete}>
          DELETE
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
  categories: state.productReducer.categories,
});

export default connect(mapStateToProps, {
  update_item,
  get_categories,
  delete_item,
})(SingleItemPage);
