import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import "../../../css/Pages/accountpage.css";
import { updateUser, getUser } from "../../../actions/user";
import { Grid, Container } from "@material-ui/core";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      surname: "",
      phone: "",
      newPassword: "",
      newPassword2: "",
      user: {},
    };
    this.onUpdateSubmit = this.onUpdateSubmit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangePasswordSubmit = this.onChangePasswordSubmit.bind(this);
  }

  static propTypes = {
    userReducer: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (this.props.userReducer.isAuthenticated === false) {
      return <Redirect to="/home" />;
    }
    if (this.props.userReducer.hasLoaded === false) {
      this.props.getUser(this.props.userReducer.user.id);
    }
    console.log(this.props.userReducer);
    this.setState({
      name: this.props.userReducer.user.personal_info.name,
      surname: this.props.userReducer.user.personal_info.surname,
      phone: this.props.userReducer.user.personal_info.phone,
      email: this.props.userReducer.user.base_user.email,
      user: this.props.userReducer.user,
    });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangePasswordSubmit(e) {
    e.preventDefault();
    const data = {
      id: this.state.user.id,
      password: this.state.newPassword,
      reason: "change_password",
    };
    this.props.updateUser(data);
  }

  onUpdateSubmit(e) {
    e.preventDefault();
    console.log(this.props.userReducer);
    const data = {
      id: this.state.user.id,
      user: {
        name: this.state.name,
        surname: this.state.surname,
        phone: this.state.phone,
      },
      reason: "update_user",
    };
    this.props.updateUser(data);
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state);
  }

  render() {
    if (sessionStorage.getItem("isAuthenticated") === "false") {
      return <Redirect to="/home" />;
    } else {
      return (
        <Container className="accountMainPage">
          <Grid spacing={3} container>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Link className="nav-text nav-text-activated" to="/account">
                Ο λογαριασμός μου
              </Link>
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Link className="nav-text" to="/account/orders">
                Οι παραγγελίες μου
              </Link>
            </Grid>
            <Grid item lg={2} md={2} sm={6} xs={12}>
              <Link className="nav-text" to="/account/addresses">
                Διευθύνσεις
              </Link>
            </Grid>

            <Grid item lg={2} md={2} sm={6} xs={12}>
              <Link className="nav-text" to="/account/ratings">
                Βαθμολογίες
              </Link>
            </Grid>
          </Grid>
          <Row className="userProfileRow bodyRow">
            <div className="roundedContainer userProfileContainer">
              <h4> Change your values</h4>
              <Form onSubmit={this.onUpdateSubmit}>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      onChange={this.onChange}
                      type="text"
                      name="name"
                      value={this.state.name}
                      placeholder="Enter Name"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      onChange={this.onChange}
                      type="text"
                      name="surname"
                      value={this.state.surname}
                      placeholder="Enter Last Name"
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      onChange={this.onChange}
                      type="email"
                      name="email"
                      value={this.state.email}
                      placeholder="Enter email"
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter phone: 69xxxxxxxx"
                      name="phone"
                      pattern="69[0-9]{8}"
                      value={this.state.phone}
                      onChange={this.onChange}
                    />
                  </Form.Group>
                </Form.Row>

                <Button variant="primary" type="submit">
                  Update
                </Button>
              </Form>
              <h4> Change your password</h4>
              <Form onSubmit={this.onChangePasswordSubmit}>
                <Form.Row>
                  <Form.Group as={Col} controlId="formPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      onChange={this.onChange}
                      type="text"
                      name="newPassword"
                      // value={this.state.newPassword}
                      placeholder="Enter Password"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formPassword2">
                    <Form.Label>Repeat Password</Form.Label>
                    <Form.Control
                      onChange={this.onChange}
                      type="text"
                      name="newPassword2"
                      // value={this.state.newPassword2}
                      placeholder="Repeat Password"
                    />
                  </Form.Group>
                </Form.Row>

                <Button variant="primary" type="submit">
                  Update
                </Button>
              </Form>
            </div>
          </Row>
        </Container>
      );
    }
  }
}

const mapStateToProps = (state) => (
  console.log(state),
  {
    userReducer: state.userReducer,
  }
);

export default connect(mapStateToProps, { updateUser, getUser })(MainPage);
