import React, { Component } from "react";
import { connect } from "react-redux";
import "../../../../css/Panel/CreatePage.css";
import CreateForm from "./CreateForm";
import { CreateOptionsData } from "./CreateOptionsData";
import {
  get_items,
  get_categories,
  get_ingredients,
  get_choices,
} from "../../../../actions/items";
import PropTypes from "prop-types";

class CreatePage extends Component {
  state = {
    selectedOption: "",
  };
  changeOption = (name) => {
    this.setState({ selectedOption: name });
  };
  static propTypes = {
    get_items: PropTypes.func.isRequired,
    get_categories: PropTypes.func.isRequired,
    get_ingredients: PropTypes.func.isRequired,
    get_choices: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };
  componentDidMount() {
    this.props.get_items();
    this.props.get_categories();
    this.props.get_ingredients();
    this.props.get_choices();
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

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {
  get_items,
  get_categories,
  get_ingredients,
  get_choices,
})(CreatePage);
