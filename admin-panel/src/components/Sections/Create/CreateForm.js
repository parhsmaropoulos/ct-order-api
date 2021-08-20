import React, { Component } from "react";
import CreateItemForm from "./CreateItemForm";
import CreateCategoryForm from "./CreateCategoryForm";
import CreateChoiceForm from "./CreateChoiceForm";
import CreateIngredientForm from "./CreateIngredientForm";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class CreateForm extends Component {
  state = {
    categories: [],
    name: "",
    description: "",
    price: 0,
    category: "",
  };

  static propTypes = {
    categories: PropTypes.array.isRequired,
  };

  renderSwitch(param) {
    switch (param) {
      case "Create Item":
        return <CreateItemForm categories={this.props.categories} />;
      case "Create Category":
        return <CreateCategoryForm />;
      case "Create Choice":
        return <CreateChoiceForm />;
      case "Create Ingredient":
        return <CreateIngredientForm />;
      default:
        return <div>Please select an option</div>;
    }
  }

  render() {
    return (
      <div className="CreateForm">{this.renderSwitch(this.props.option)}</div>
    );
  }
}

const mapStateToProps = (state) => ({
  categories: state.productReducer.categories,
});
export default connect(mapStateToProps, {})(CreateForm);
