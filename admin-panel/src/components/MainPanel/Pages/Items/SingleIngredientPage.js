import React, { Component } from "react";
import { connect } from "react-redux";
import { update_ingredient, delete_item } from "../../../../actions/items";
import PropTypes from "prop-types";
import { Button, Form } from "react-bootstrap";

class SingleIngredientPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: 0,
      category: "",
      description: "",
      ingredient: {},
      display: "none",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    update_ingredient: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
  };

  onSubmit(event) {
    event.preventDefault();
    const ingredient = {
      name: this.state.name,
      description: this.state.description,
      price: parseFloat(this.state.price),
      category: this.state.category,
    };
    // Check if there is any change in the values
    if (this.state.name === "") {
      ingredient.name = this.state.ingredient.name;
    }
    if (this.state.description === "") {
      ingredient.description = this.state.ingredient.description;
    }
    if (this.state.price === 0) {
      ingredient.price = this.state.ingredient.price;
    }
    if (this.state.category === "") {
      ingredient.category = this.state.ingredient.category;
    }
    // TODO change image
    // console.log(ingredient);
    this.props.update_ingredient(
      this.state.ingredient.id,
      ingredient,
      "update_ingredient"
    );
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

  onDelete = () => {
    const id = this.state.item.id;
    const type = "ingredient";
    this.props.delete_item(id, type);
  };

  onChange = (e) => {
    if (e.target.value === "Create New") {
      this.showNewCat(true);
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  componentWillMount() {
    this.setState({ ingredient: this.props.location.state.ingredient });
    // console.log(this.props);
  }
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Ingredient Name</Form.Label>
          <Form.Control
            type="text"
            placehodler="Enter name"
            defaultValue={this.state.ingredient.name}
            name="name"
            onChange={this.onChange}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Ingredient description</Form.Label>
          <Form.Control
            type="text"
            defaultValue={this.state.ingredient.description}
            placeholder="Enter desc"
            name="description"
            onChange={this.onChange}
          />
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Ingredient price</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            defaultValue={this.state.ingredient.price}
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
            defaultValue={this.state.ingredient.category}
            required
          >
            {this.props.categories.length > 0 ? (
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
  categories: state.productReducer.ingredientCategories,
});

export default connect(mapStateToProps, {
  update_ingredient,
  delete_item,
})(SingleIngredientPage);
