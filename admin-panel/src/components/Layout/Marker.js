import React, { Component } from "react";
import "../../css/common/marker.css";

class Marker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "",
      name: "",
      id: "",
    };
  }
  componentDidMount() {}
  render() {
    let color = this.props.color;
    let name = this.props.name;
    // let id = this.props.id;
    return (
      <div>
        <div
          className="pin bounce"
          style={{ backgroundColor: color, cursor: "pointer" }}
          title={name}
        />
        <div className="pulse" />
      </div>
    );
  }
}

export default Marker;
