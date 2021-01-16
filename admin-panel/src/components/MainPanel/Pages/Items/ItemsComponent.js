import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import "../../../../css/Panel/ItemsPage.css";
import axios from "axios";
import { Button, Form } from "react-bootstrap";

class ItemsComponent extends Component {
  state = {
    selectedCategory: "",
  };
  changeCategory = (categoryName) => {
    this.setState({ selectedCategory: categoryName });
  };
  render() {
    return (
      <div className="ItemsComponent">
        <div className="Categoriestable">
          <ul className="Categorylist">
            {this.props.categories.map((category, key) => {
              return (
                <li key={key} className="row">
                  {" "}
                  <div
                    id="button"
                    name="selectedCategory"
                    onClick={() => this.changeCategory(category.name)}
                  >
                    {category.name}
                  </div>
                </li>
              );
            })}
            <li className="row">
              <div
                id="button"
                name="selectedCategory"
                onClick={() => this.changeCategory("ingredients")}
              >
                Ingredients
              </div>
            </li>
          </ul>
        </div>
        <Table bordered striped className="Itemstable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.selectedCategory == "ingredients"
              ? this.props.ingredients.map((ingredient, index) => {
                  return (
                    <tr key={index}>
                      <td>{ingredient.name}</td>
                      <td>{ingredient.price}</td>
                      <td>{ingredient.description}</td>
                      <td>
                        <Form>
                          {ingredient.available ? (
                            <Form.Check
                              type="switch"
                              defaultChecked={true}
                              id="custom-switch"
                            />
                          ) : (
                            <Form.Check
                              type="switch"
                              defaultChecked={false}
                              id="custom-switch"
                            />
                          )}
                        </Form>
                      </td>
                    </tr>
                  );
                })
              : this.props.products.map((item, index) => {
                  if (item.category == this.state.selectedCategory) {
                    return (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>{item.description}</td>
                        <td>
                          <Form>
                            {item.available ? (
                              <Form.Check
                                type="switch"
                                defaultChecked={true}
                                id="custom-switch"
                              />
                            ) : (
                              <Form.Check
                                type="switch"
                                defaultChecked={false}
                                id="custom-switch"
                              />
                            )}
                          </Form>
                        </td>
                      </tr>
                    );
                  }
                })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default ItemsComponent;
