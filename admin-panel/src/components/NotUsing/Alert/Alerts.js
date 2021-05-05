import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";

export class Alerts extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
  };

  removeAlert() {}

  render() {
    if (this.props.error !== null) {
      console.log(this.props);
    }
    return <Fragment />;
  }
}

const mapStateToProps = (state) => ({
  error: state.errorReducer.statusText,
  message: state.errorReducer.message,
});

export default connect(mapStateToProps)(withAlert()(Alerts));
