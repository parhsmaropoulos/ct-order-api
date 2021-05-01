import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import "../../../../css/Panel/ItemsPage.css";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { update_ingredient } from "../../../../actions/items";
import { PencilFill } from "react-bootstrap-icons";

class IngredientsComponent extends Component {
  state = {
    selectedCategory: 0,
  };
  changeCategory = (categoryIndex) => {
    console.log(categoryIndex);
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
    update_ingredient: PropTypes.func.isRequired,
  };

  changeAvailabilityIngredient(item) {
    this.props.update_ingredient(item.id, item, "change_availability");
  }

  render() {
    return (
      <div className="ItemsComponent">
        <div className="Categoriestable">
          <ul className="Categorylist">
            {this.props.ingredients.length > 0
              ? this.props.ingredients.map((ingredient_categories, key) => {
                  return (
                    <li
                      key={key}
                      className="row"
                      onClick={() => this.changeCategory(key)}
                    >
                      {" "}
                      <div id="button" name="selectedCategory">
                        {ingredient_categories[0].category}
                      </div>
                    </li>
                  );
                })
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
                            defaultChecked={ingredient.available}
                            onChange={() =>
                              this.changeAvailabilityIngredient(ingredient)
                            }
                            id={ingredient.id}
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
});

export default connect(mapStateToProps, {
  update_ingredient,
})(IngredientsComponent);
