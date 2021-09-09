import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import { create_ingredient } from "../../../actions/items";
import { auth_post_request } from "../../../actions/lib";
import "../../../css/Pages/createpage.css";
import { CREATE_INGREDIENT } from "../../../actions/actions";

class CreateIngredientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: 0,
      description: "",
      category: "",
      display: "none",
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    create_ingredient: PropTypes.func.isRequired,
    auth_post_request: PropTypes.array.isRequired,
  };

  componentDidMount() {
    if (this.props.categories.length>0) {
      this.setState({
        category: this.props.categories[0],
      });
    }
  }

  async onSubmit(event) {
    event.preventDefault();
    const ingredient = {
      name: this.state.name.trim(),
      price: parseFloat(this.state.price),
      description: this.state.description,
      category: this.state.category.trim(),
    };
    await this.props.auth_post_request("ingredients/create_ingredient", ingredient, CREATE_INGREDIENT)
    // this.props.create_ingredient(ingredient);
    this.setState({
      name: "",
      price: 0,
      description: "",
      category: "",
      display: "none",
    });
  }
  showNewCat = (bool) => {
    if (bool) {
      this.setState({
        display: "block",
      });
    } else {
      this.setState({
        display: "none",
      });
    }
  };

  onChange = (e) => {
    console.log("here");
    if (e.target.value === "Create New") {
      this.showNewCat(true);
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Ingredient Name *</Form.Label>
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
          <Form.Label>Ingredient price *</Form.Label>
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
          <Form.Control
            as="select"
            name="category"
            onChange={this.onChange}
            required
          >
            {this.props.categories.length>0 ? (
              this.props.categories.map((category, index) => {
                return <option key={index}>{category}</option>;
              })
            ) : (
              <option key="0">No categories yet</option>
            )}
            <option key="100">Create New</option>
          </Form.Control>
        </Form.Group>
        <Form.Group
          controlId="newcategory"
          style={{ display: this.state.display }}
        >

          <Form.Label>New Category </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter new category"
            name="category"
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

const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
  categories: state.productReducer.ingredientCategories,
});

export default connect(mapStateToProps, { auth_post_request })(
  CreateIngredientForm
);
