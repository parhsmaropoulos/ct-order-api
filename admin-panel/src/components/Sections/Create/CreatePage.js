import React, { Component } from "react";
import { connect } from "react-redux";
import "../../../css/Pages/createpage.css";
import CreateForm from "./CreateForm";
import { CreateOptionsData } from "./CreateOptionsData";

import { auth_get_request } from "../../../actions/lib";
import PropTypes from "prop-types";
import { GET_CATEGORIES, GET_CHOICES, GET_INGREDIENTS, GET_ITEMS } from "../../../actions/actions";

class CreatePage extends Component {
  state = {
    selectedOption: "",
  };
  changeOption = (name) => {
    this.setState({ selectedOption: name });
  };
  static propTypes = {
    productReducer: PropTypes.object.isRequired,
    auth_get_request: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };
  componentDidMount() {
    this.get_items();
    this.get_choices();
    this.get_categories();
    this.get_ingredients();
  }

  async get_items() {
    await this.props.auth_get_request("products/all", GET_ITEMS);
  }
  async get_categories() {
    await this.props.auth_get_request("product_category/all",GET_CATEGORIES)
  }
  async get_choices() {
    await this.props.auth_get_request("product_choices/all",GET_CHOICES)
  }
  async get_ingredients() {
    await this.props.auth_get_request("ingredients/all",GET_INGREDIENTS)
  }
  render() {
    return (
      <div className="CreatePage">
        <div className="Createoptions">
          <ul className="Optionlist">
            {CreateOptionsData.map((option, key) => {
              return (
                <li key={key} className="row">
                  {" "}
                  <div
                    id="button"
                    name="selectedOption"
                    onClick={() => this.changeOption(option.name)}
                  >
                    {option.name}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <CreateForm option={this.state.selectedOption} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  productReducer: state.productReducer,
});
export default connect(mapStateToProps, {auth_get_request
})(CreatePage);
