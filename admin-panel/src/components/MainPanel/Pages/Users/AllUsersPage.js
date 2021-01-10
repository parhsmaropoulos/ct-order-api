import axios from "axios";
import React, { Component } from "react";

class AllUsersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }
  componentDidMount() {
    axios.get("http://localhost:8080/users");
  }
  render() {
    return (
      <div>
        <h3>Edw einai ta paidia!!</h3>
      </div>
    );
  }
}

export default AllUsersPage;
