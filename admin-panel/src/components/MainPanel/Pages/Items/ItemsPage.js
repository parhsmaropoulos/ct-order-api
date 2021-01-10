import React, { Component } from "react";
import ItemsComponent from "./ItemsComponent";
import axios from "axios";

class ItemsPage extends Component {
  state = {
    items: [],
    categories: [],
    ingredients: [],
  };

  componentDidMount() {
    axios
      .get("http://localhost:8080/products/all")
      .then((res) => {
        this.setState({ items: res.data.data });
      })
      .then(
        axios.get("http://localhost:8080/product_category/all").then((res) => {
          this.setState({ categories: res.data.data });
        })
      )
      .then(
        axios.get("http://localhost:8080/products/ingredients").then((res) => {
          this.setState({ ingredients: res.data.data });
        })
      );
  }
  render() {
    return (
      <div>
        <h1>ItemPage</h1>
        <ItemsComponent
          items={this.state.items}
          categories={this.state.categories}
          ingredients={this.state.ingredients}
        />
      </div>
    );
  }
}

export default ItemsPage;
