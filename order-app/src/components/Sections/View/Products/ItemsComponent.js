import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import "../../../../css/Pages/ItemsPage.css";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { PencilFill } from "react-bootstrap-icons";
import { auth_put_request } from "../../../../actions/lib";
import { CHANGE_AVAILABILITY } from "../../../../actions/actions";

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
    auth_put_request: PropTypes.func.isRequired,
  };

  componentDidMount() {}

  changeAvailability(id) {
    this.props.auth_put_request(
      `products/${id}/change_availability`,
      null,
      CHANGE_AVAILABILITY
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
                  onClick={() => this.changeCategory(category.ID)}
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
                })
              : this.props.products.map((item, index) => {
                  if (item.category_id === this.state.selectedCategory) {
                    return (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>{item.description}</td>
                        <td>
                          <Form.Check
                            type="switch"
                            defaultChecked={item.available}
                            onChange={() => this.changeAvailability(item.ID)}
                            id={item.ID}
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
  categories: state.productReducer.categories,
  products: state.productReducer.products,
  ingredients: state.productReducer.ingredients,
  order_accepted: state.orderReducer.accepted,
  order_sent: state.orderReducer.sent,
});

export default connect(mapStateToProps, {
  auth_put_request,
})(ItemsComponent);
