import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import "../../../../css/Pages/ItemsPage.css";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { send_order } from "../../../../actions/orders";
import {
  update_item,
  change_item_availability,
  update_ingredient,
} from "../../../../actions/items";
import { PencilFill } from "react-bootstrap-icons";

class ItemsComponent extends Component {
  state = {
    selectedCategory: 0,

    product_ids: [],
    user_id: null,
  };
  changeCategory = (categoryID) => {
    this.setState({ selectedCategory: categoryID });
  };

  static propTypes = {
    send_order: PropTypes.func.isRequired,
    update_item: PropTypes.func.isRequired,
    change_item_availability: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.setState({ user_id: this.props.user_Id });
  }

  changeAvailability(item) {
    this.props.change_item_availability(item.id);
  }
  changeAvailabilityIngredient(item) {
    this.props.update_ingredient(
      item.id,
      item.base_ingredient,
      "change_availability"
    );
  }

  render() {
    return (
      <div className="ItemsComponent">
        <div className="Categoriestable">
          <ul className="Categorylist">
            {this.props.categories.map((category, key) => {
              return (
                <li
                  key={key}
                  className="row"
                  onClick={() => this.changeCategory(category.id)}
                >
                  {" "}
                  <div id="button" name="selectedCategory">
                    {category.base_category.name}
                  </div>
                </li>
              );
            })}
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
            {this.state.selectedCategory === "ingredients"
              ? this.props.ingredients.map((ingredient, index) => {
                  // console.log(ingredient);
                  return (
                    <tr key={index}>
                      <td>{ingredient.base_ingredient.name}</td>
                      <td>{ingredient.base_ingredient.price}</td>
                      <td>{ingredient.base_ingredient.description}</td>
                      {/* <td>{ingredient.category}</td> */}
                      <td>
                        <Form.Check
                          type="switch"
                          defaultChecked={ingredient.base_ingredient.available}
                          onChange={() =>
                            this.changeAvailabilityIngredient(
                              ingredient.base_ingredient
                            )
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
                              ingredient: ingredient.base_ingredient,
                            },
                          }}
                        >
                          <PencilFill />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              : this.props.products.map((item, index) => {
                  if (
                    item.base_product.category_id ===
                    this.state.selectedCategory
                  ) {
                    return (
                      <tr key={index}>
                        <td>{item.base_product.name}</td>
                        <td>{item.base_product.price}</td>
                        <td>{item.base_product.description}</td>
                        <td>
                          <Form.Check
                            type="switch"
                            defaultChecked={item.base_product.available}
                            onChange={() => this.changeAvailability(item)}
                            id={item.id}
                            label="Available"
                          />
                        </td>
                        <td>
                          <Link
                            to={{
                              pathname: "/single_item",
                              state: {
                                item: item,
                              },
                            }}
                          >
                            <PencilFill />
                          </Link>
                        </td>
                      </tr>
                    );
                  } else {
                    return <tr key={index}></tr>;
                  }
                })}
          </tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
  // user_id: state.userReducer.user.id,
  categories: state.productReducer.categories,
  products: state.productReducer.products,
  ingredients: state.productReducer.ingredients,
  order_accepted: state.orderReducer.accepted,
  order_sent: state.orderReducer.sent,
});

export default connect(mapStateToProps, {
  send_order,
  update_item,
  update_ingredient,
  change_item_availability,
})(ItemsComponent);
