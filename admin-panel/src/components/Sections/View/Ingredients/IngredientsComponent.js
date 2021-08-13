import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import "../../../../css/Pages/ItemsPage.css";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { change_ingredient_availability } from "../../../../actions/items";
import { PencilFill } from "react-bootstrap-icons";
import { auth_put_request } from "../../../../actions/lib";
import { CHANGE_AVAILABILITY } from "../../../../actions/actions";


class IngredientsComponent extends Component {
  state = {
    selectedCategory: 0,
  };
  changeCategory = (categoryIndex) => {
    console.log(this.props.ingredients);
    this.setState({ selectedCategory: categoryIndex });
  };

  componentDidMount() {
    if (this.props.ingredients.length > 0) {
      this.setState({
        selectedCategory: 0,
      });
    }
  }

  static propTypes = {
    auth_put_request: PropTypes.func.isRequired,
  };

  async changeAvailabilityIngredient(id) {
    await this.props.auth_put_request(`ingredients/${id}/change_availability`,null,CHANGE_AVAILABILITY)
  }

  render() {
    return (
      <div className="ItemsComponent">
        <div className="Categoriestable">
          <ul className="Categorylist">
            {this.props.ingredientCategories.length > 0
              ? this.props.ingredientCategories.map(
                  (ingredient_category, key) => {
                    return (
                      <li
                        key={key}
                        className="row"
                        onClick={() => this.changeCategory(key)}
                      >
                        {" "}
                        <div id="button" name="selectedCategory">
                          {ingredient_category}
                        </div>
                      </li>
                    );
                  }
                )
              : null}
          </ul>
        </div>
        <Table bordered striped className="Itemstable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.props.ingredients.length > 0
              ? this.props.ingredients[this.state.selectedCategory].map(
                  (ingredient, index) => {
                    return (
                      <tr key={index}>
                        <td>{ingredient.name}</td>
                        <td>{ingredient.price}</td>
                        <td>{ingredient.description}</td>
                        <td>
                          <Form.Check
                            type="switch"
                            checked={ingredient.available}
                            onChange={() =>
                              this.changeAvailabilityIngredient(ingredient.ID)
                            }
                            id={ingredient.ID}
                            label="Available"
                          />
                        </td>
                        <td>
                          <Link
                            to={{
                              pathname: "/single_ingredient",
                              state: {
                                ingredient: ingredient,
                              },
                            }}
                          >
                            <PencilFill />
                          </Link>
                        </td>
                      </tr>
                    );
                  }
                )
              : null}
          </tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
  ingredients: state.productReducer.ingredients,
  ingredientCategories: state.productReducer.ingredientCategories,
});

export default connect(mapStateToProps, {
  auth_put_request,
})(IngredientsComponent);
