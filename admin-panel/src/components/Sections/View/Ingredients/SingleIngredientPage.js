import React, { Component } from "react";
import { connect } from "react-redux";
// import { update_ingredient, delete_item } from "../../../../actions/items";
import PropTypes from "prop-types";
import { Button, Form } from "react-bootstrap";
import { auth_delete_request,auth_put_request } from "../../../../actions/lib";
import { UPDATE_ITEM } from "../../../../actions/actions";


class SingleIngredientPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: 0,
      category: 0,
      description: "",
      id: 0,
      display: "none",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    auth_put_request: PropTypes.func.isRequired,
    auth_delete_request: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
  };

  async onSubmit(event) {
    event.preventDefault();
    const ingredient = {
      name: this.state.name.trim(),
      description: this.state.description.trim(),
      price: parseFloat(this.state.price),
      category: this.state.category,
    };
    // TODO change image
    // console.log(ingredient);
    await this.props.auth_put_request(`ingredients/${this.state.id}/update_values`,ingredient,UPDATE_ITEM)
    // this.props.update_ingredient(this.state.id, ingredient);
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
    this.props.auth_delete_request(`ingrediets/${id}`)
  };

  onChange = (e) => {
    if (e.target.value === "Create New") {
      this.showNewCat(true);
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  componentWillMount() {
    let oldIngredient = this.props.location.state.ingredient;

    this.setState({
      id: oldIngredient.ID,
      name: oldIngredient.name,
      price: oldIngredient.price,
      category: oldIngredient.category,
      description: oldIngredient.description,
    });
  }
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Ingredient Name</Form.Label>
          <Form.Control
            type="text"
            placehodler="Enter name"
            defaultValue={this.state.name}
            name="name"
            onChange={this.onChange}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Ingredient description</Form.Label>
          <Form.Control
            type="text"
            defaultValue={this.state.description}
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
            defaultValue={this.state.price}
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
            defaultValue={this.state.category}
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
  auth_delete_request,
  auth_put_request,
})(SingleIngredientPage);
