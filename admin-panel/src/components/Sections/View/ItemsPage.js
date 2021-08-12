import React, { Component } from "react";
import ItemsComponent from "./Products/ItemsComponent";
import {
  get_items,
  get_categories,
  get_ingredients,
  get_choices,
} from "../../../actions/items";
import { auth_get_request } from "../../../actions/lib";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import IngredientsComponent from "./Ingredients/IngredientsComponent";
import ChoicesComponent from "./Choices/ChoicesComponent";
import { GET_ITEMS } from "../../../actions/actions";

class ItemsPage extends Component {
  static propTypes = {
    get_items: PropTypes.func.isRequired,
    get_categories: PropTypes.func.isRequired,
    get_ingredients: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    ingredients: PropTypes.array.isRequired,
    choices: PropTypes.array.isRequired,
    isAuthenticated: PropTypes.bool,
    isReady: PropTypes.bool,
    auth_get_request: PropTypes.func.isRequired,
  };

  componentDidMount() {
    // if (this.props.isReady === false) {
    //   this.props.get_items();
    //   this.props.get_categories();
    //   this.props.get_ingredients();
    //   this.props.get_choices();
    // }
    this.get_items();
  }

  async get_items() {
    this.props.auth_get_request("products/all", GET_ITEMS);
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
  isAuthenticated: state.userReducer.isAuthenticated,
  categories: state.productReducer.categories,
  products: state.productReducer.products,
  ingredients: state.productReducer.ingredients,
  choices: state.productReducer.choices,
  isReady: state.productReducer.isReady,
});

export default connect(mapStateToProps, {
  get_items,
  get_categories,
  get_ingredients,
  get_choices,
  auth_get_request,
})(ItemsPage);
