import React, { Component } from "react";
import { connect } from "react-redux";
import "../../../../../css/OrderPage/LeftBar.css";

class LeftSideBar extends Component {
  componentDidMount() {
    console.log(this.props);
  }

  changeCategory = (categoryName) => {
    this.setState({ selectedCategory: categoryName });
  };
  render() {
    return (
      <div className="leftSideBar">
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
    );
  }
}

export default connect()(LeftSideBar);
