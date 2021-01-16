import React, { Component } from "react";
import ItemsComponent from "./ItemsComponent";
import { get_items, get_categories } from "../../../../actions/items";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class ItemsPage extends Component {
  // state = {
  //   products: [],
  //   categories: [],
  //   ingredients: [],
  // };
  static propTypes = {
    get_items: PropTypes.func.isRequired,
    get_categories: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    ingredients: PropTypes.array.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  componentDidMount() {
    this.props.get_items();
    this.props.get_categories();
  }
  render() {
    return (
      <div>
        <h1>ItemPage</h1>
        <ItemsComponent
          products={this.props.products}
          categories={this.props.categories}
          ingredients={this.props.ingredients}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
  categories: state.productReducer.categories,
  products: state.productReducer.products,
});

export default connect(mapStateToProps, { get_items, get_categories })(
  ItemsPage
);
