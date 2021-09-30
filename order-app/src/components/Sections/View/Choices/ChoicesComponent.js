import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import "../../../../css/Pages/ItemsPage.css";
// import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { update_choice } from "../../../../actions/items";
import { Check, PencilFill } from "react-bootstrap-icons";

class ChoicesComponent extends Component {
  state = {
    selectedChoice: 0,
  };
  changeCategory = (categoryIndex) => {
    console.log(categoryIndex);
    this.setState({ selectedChoice: categoryIndex });
  };

  componentDidMount() {
    console.log(this.props.choices);
    if (this.props.choices.length > 0) {
      this.setState({
        selectedChoice: 0,
      });
    }
  }

  static propTypes = {
    update_choice: PropTypes.func.isRequired,
    choices: PropTypes.array.isRequired,
  };

  render() {
    return (
      <div className="ItemsComponent">
        <div className="Categoriestable">
          <ul className="Categorylist">
            {this.props.choices.length > 0
              ? this.props.choices.map((choice, key) => {
                  return (
                    <li
                      key={key}
                      className="row"
                      onClick={() => this.changeCategory(key)}
                    >
                      {" "}
                      <div id="button" name="selectedCategory">
                        {choice.name}
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
              <th>Options</th>
              <th>Description</th>
              <th>Required</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.props.choices.length > 0 ? (
              <tr>
                <td>{this.props.choices[this.state.selectedChoice].name}</td>
                <td>
                  <ul>
                    {this.props.choices[this.state.selectedChoice].options.map(
                      (option, index) => {
                        return (
                          <li key={index}>
                            {option.name} - {option.price}
                          </li>
                        );
                      }
                    )}
                  </ul>
                </td>
                <td>
                  {this.props.choices[this.state.selectedChoice].description}
                </td>
                <td>
                  {this.props.choices[this.state.selectedChoice].required ? (
                    <p>
                      <Check />
                    </p>
                  ) : (
                    <p></p>
                  )}
                </td>
                <td>
                  <Link
                    to={{
                      pathname: "/single_choice",
                      state: {
                        choice: this.props.choices[this.state.selectedChoice],
                      },
                    }}
                  >
                    <PencilFill />
                  </Link>
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  choices: state.productReducer.choices,
});

export default connect(mapStateToProps, {
  update_choice,
})(ChoicesComponent);
