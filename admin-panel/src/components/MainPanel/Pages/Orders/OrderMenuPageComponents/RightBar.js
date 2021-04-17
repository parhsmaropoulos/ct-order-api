import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "../../../../../css/OrderPage/RightBar.css";
class RightBar extends Component {
  static propTypes = {
    orderDetails: PropTypes.object.isRequired,
  };

  componentDidMount() {
    console.log(this.props);
  }
  render() {
    return <div className="rightBar">Right Bar</div>;
  }
}

const mapStateToProps = (state) => ({
  orderDetails: state.orderReducer,
});

export default connect(mapStateToProps)(RightBar);
