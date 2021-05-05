import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import "../../../../css/Pages/ItemsPage.css";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { send_order } from "../../../../actions/orders";
import { update_item, update_ingredient } from "../../../../actions/items";
import { PencilFill } from "react-bootstrap-icons";

class ItemsComponent extends Component {
  state = {
    selectedCategory: "",

    product_ids: [],
    user_id: null,
  };
  changeCategory = (categoryName) => {
    this.setState({ selectedCategory: categoryName });
  };

  static propTypes = {
    send_order: PropTypes.func.isRequired,
    update_item: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.setState({ user_id: this.props.user_Id });
  }

  changeAvailability(item) {
    this.props.update_item(item.id, item, "change_availability");
  }
  changeAvailabilityIngredient(item) {
    this.props.update_ingredient(item.id, item, "change_availability");
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
                  onClick={() => this.changeCategory(category.name)}
                >
                  {" "}
                  <div id="button" name="selectedCategory">
                    {category.name}
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
                      <td>{ingredient.name}</td>
                      <td>{ingredient.price}</td>
                      <td>{ingredient.description}</td>
                      {/* <td>{ingredient.category}</td> */}
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
                })
              : this.props.products.map((item, index) => {
                  if (item.category === this.state.selectedCategory) {
                    return (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>{item.description}</td>
                        <td>
                          <Form.Check
                            type="switch"
                            defaultChecked={item.available}
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
})(ItemsComponent);
