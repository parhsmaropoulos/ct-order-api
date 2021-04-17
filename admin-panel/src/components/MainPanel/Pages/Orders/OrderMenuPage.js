import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import LeftSideBar from "./OrderMenuPageComponents/LeftSideBar";
import TopBar from "./OrderMenuPageComponents/TopBar";
import MainContent from "./OrderMenuPageComponents/MainContent";
import RightBar from "./OrderMenuPageComponents/RightBar";
import "../../../../css/OrderPage/OrderMenuPage.css";

class OrderMenuPage extends Component {
  static propTypes = {
    products: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
  };
  render() {
    return (
      <div>
        {/* <div>Main page</div>{" "} */}
        <div className="orderMenuContainer">
          {" "}
          <TopBar />
          <LeftSideBar categories={this.props.categories} />
          <MainContent products={this.props.products} />
          <RightBar />{" "}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  products: state.productReducer.products,
  categories: state.productReducer.categories,
});

export default connect(mapStateToProps)(OrderMenuPage);
