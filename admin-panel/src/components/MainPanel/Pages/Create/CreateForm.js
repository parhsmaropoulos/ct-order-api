import React, { Component } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import CreateItemForm from "./CreateItemForm";
import CreateCategoryForm from "./CreateCategoryForm";
import CreateChoiceForm from "./CreateChoiceForm";
import CreateIngredientForm from "./CreateIngredientForm";

class CreateForm extends Component {
  state = {
    categories: [],
    name: "",
    description: "",
    price: 0,
    category: "",
  };

  componentDidMount() {
    axios.get("http://localhost:8080/product_category/all").then((res) => {
      this.setState({ categories: res.data.data });
    });
  }

  renderSwitch(param) {
    switch (param) {
      case "Create Item":
        return <CreateItemForm categories={this.state.categories} />;
      case "Create Category":
        return <CreateCategoryForm />;
      case "Create Choice":
        return <CreateChoiceForm />;
      case "Create Ingredient":
        return <CreateIngredientForm />;
      default:
        return <div>Please select an option</div>;
        break;
    }
  }

  render() {
    return (
      <div className="CreateForm">{this.renderSwitch(this.props.option)}</div>
    );
  }
}

export default CreateForm;
