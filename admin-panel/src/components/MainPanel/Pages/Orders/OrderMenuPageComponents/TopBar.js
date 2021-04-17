import React, { Component } from "react";
import { connect } from "react-redux";
import "../../../../../css/OrderPage/TopBar.css";
import { Button, Form, FormControl, Navbar } from "react-bootstrap";
class TopBar extends Component {
  render() {
    return (
      <div className="topBar">
        <Navbar bg="dark" variant="dark" sticky="top">
          <Navbar.Brand href="/">Home/Logo</Navbar.Brand>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-info">Search</Button>
          </Form>
        </Navbar>
      </div>
    );
  }
}

export default connect()(TopBar);
