import React, { Component } from "react";
import ItemsComponent from "./Products/ItemsComponent";
import { auth_get_request } from "../../../actions/lib";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import IngredientsComponent from "./Ingredients/IngredientsComponent";
import ChoicesComponent from "./Choices/ChoicesComponent";
import {
  GET_CATEGORIES,
  GET_CHOICES,
  GET_INGREDIENTS,
  GET_ITEMS,
} from "../../../actions/actions";

class ItemsPage extends Component {
  static propTypes = {
    products: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    ingredients: PropTypes.array.isRequired,
    choices: PropTypes.array.isRequired,

    auth_get_request: PropTypes.func.isRequired,
    isReady: PropTypes.bool,
  };

  componentDidMount() {
    if (this.props.isReady === false) {
    }
    this.get_items();
    this.get_choices();
    this.get_categories();
    this.get_ingredients();
  }

  async get_items() {
    await this.props.auth_get_request("products/all", GET_ITEMS);
  }
  async get_categories() {
    await this.props.auth_get_request("product_category/all", GET_CATEGORIES);
  }
  async get_choices() {
    await this.props.auth_get_request("product_choices/all", GET_CHOICES);
  }
  async get_ingredients() {
    await this.props.auth_get_request("ingredients/all", GET_INGREDIENTS);
  }

  render() {
    return (
      <div>
        {this.props.location.pathname === "/choices" ? (
          <ChoicesComponent choices={this.props.choices} />
        ) : this.props.location.pathname === "/ingredients" ? (
          <IngredientsComponent ingredients={this.props.ingredients} />
        ) : (
          <ItemsComponent
            products={this.props.products}
            categories={this.props.categories}
            ingredients={this.props.ingredients}
            choices={this.props.choices}
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  categories: state.productReducer.categories,
  products: state.productReducer.products,
  ingredients: state.productReducer.ingredients,
  choices: state.productReducer.choices,
  isReady: state.productReducer.isReady,
});

export default connect(mapStateToProps, { auth_get_request })(ItemsPage);
