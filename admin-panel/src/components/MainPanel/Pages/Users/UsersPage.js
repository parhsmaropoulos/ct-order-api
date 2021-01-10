import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

class UsersPage extends Component {
  render() {
    return (
      <div>
        <h1>UsersPage</h1>

        <Button>
          <Link to="/register">
            <div style={{ color: "white" }}>Register</div>
          </Link>
        </Button>
        <Button>
          <Link to="/login">
            <div style={{ color: "white" }}>Login</div>
          </Link>
        </Button>

        <h2>TEFTERI!!</h2>
        <Button>
          <Link to="/all_users">
            <div style={{ color: "white" }}>Users</div>
          </Link>
        </Button>
      </div>
    );
  }
}

export default UsersPage;
