import React, { Component } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { login } from "../../../../actions/user";
import PropTypes from "prop-types";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  onSubmit(e) {
    e.preventDefault();
    // const credits = {
    //   email: this.state.email,
    //   password: this.state.password,
    // };
    // console.log(credits);
    this.props.login(this.state.email, this.state.password);
    // axios
    //   .post("http://localhost:8080/user/login", credits, headers)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
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
              type="email"
              placeholder="Enter Email"
              required
              name="email"
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
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

const mapStateToProps = (state) => ({
  isAuthenticated: state.isAuthenticated,
});

export default connect(mapStateToProps, { login })(LoginForm);
