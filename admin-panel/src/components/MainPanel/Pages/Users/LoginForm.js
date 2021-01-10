import axios from "axios";
import React, { Component } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { headers } from "../../../../utils/axiosHeaders";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {
    e.preventDefault();
    const credits = {
      email: this.state.email,
      password: this.state.password,
    };
    console.log(credits);

    axios
      .post("http://localhost:8080/user/login", credits, headers)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <h3>User Details</h3>
        <Form.Row>
          <Form.Group as={Col} controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Email"
              name="email"
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={this.onChange}
            />
          </Form.Group>
        </Form.Row>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

export default LoginForm;
