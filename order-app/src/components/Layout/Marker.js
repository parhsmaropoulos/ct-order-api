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
          className="animate-bounce w-6 h-6 rounded-tl-lg rounded-tr-lg rounded-br-lg -rotate-45 -mb-3 ml-0 mr-0 -mr-3  rounded-bl-none  top-1/2 left-1/2"
          style={{ backgroundColor: color, cursor: "pointer" }}
          title={name}
        />
        <div className="pulse" />
      </div>
    );
  }
}

export default Marker;
