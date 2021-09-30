import React, { Component } from "react";
import { Button, Col, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { register } from "../../../../actions/user";
import { connect } from "react-redux";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      name: "",
      surname: "",
      phone: "",
      address: "",
      zipcode: "",
      bellname: "",
      details: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  static propTypes = {
    register: PropTypes.func.isRequired,
  };
  onSubmit(e) {
    e.preventDefault();
    const user = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      name: this.state.name,
      surname: this.state.surname,
      phone: this.state.phone,
      address: this.state.address,
      zipcode: this.state.zipcode,
      bellname: this.state.bellname,
      details: this.state.details,
    };
    this.props.register(user);
    // axios
    //   .post("http://localhost:8080/user/create_profile", user, headers)
    //   .then((res) => console.log(res));
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <h3>User Details</h3>
        <Form.Row>
          <Form.Group as={Col} controlId="formName">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Enter Name"
              name="name"
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formSurname">
            <Form.Label>Surname *</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Surame"
              name="surname"
              onChange={this.onChange}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formEmail">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              required
              type="mail"
              placeholder="Enter Email"
              name="email"
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formUsername">
            <Form.Label>Username </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              name="username"
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formPassword">
            <Form.Label>Password *</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={this.onChange}
            />
          </Form.Group>
        </Form.Row>
        <h3>House Details</h3>
        <Form.Row>
          <Form.Group as={Col} controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Address"
              name="address"
              onChange={this.onChange}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter City"
              name="city"
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formZipcode">
            <Form.Label>Zipcode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Zipcode"
              name="zipcode"
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formBellName">
            <Form.Label>Bell Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Bell Name"
              name="bellname"
              onChange={this.onChange}
            />
          </Form.Group>
        </Form.Row>
        <h3>Extra</h3>
        <Form.Row>
          <Form.Group as={Col} controlId="formDetails">
            <Form.Label>Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter Details"
              name="details"
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

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { register })(RegisterForm);
