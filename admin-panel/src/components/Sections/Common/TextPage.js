import React, { Component } from "react";
import { connect } from "react-redux";
import TextData from "./TextData";

class TextPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.match.params) {
      return {
        title: props.match.params.type,
      };
    }
    return null;
  }
  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
      </div>
    );
  }
}

export default connect()(TextPage);
