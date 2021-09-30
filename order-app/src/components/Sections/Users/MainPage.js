import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../../css/Pages/accountpage.css";
import { auth_get_request, auth_put_request } from "../../../actions/lib";

import { Grid, Container } from "@material-ui/core";
import { GET_USER, UPDATE_USER } from "../../../actions/actions";
import withAuthorization from "../../../firebase/withAuthorization";
import Header from "../../Layout/Header";

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
    auth_get_request: PropTypes.func.isRequired,
    auth_put_request: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (this.props.userReducer.hasLoaded === false) {
      this.get_user();
    } else {
      this.setState({
        name: this.props.userReducer.user.name,
        surname: this.props.userReducer.user.surname,
        phone: this.props.userReducer.user.phone,
        email: this.props.userReducer.user.email,
        user: this.props.userReducer.user,
      });
    }
  }
  async get_user() {
    await this.props.auth_get_request(
      `user/${sessionStorage.getItem("userID")}`,
      GET_USER
    );
    this.setState({
      name: this.props.userReducer.user.name,
      surname: this.props.userReducer.user.surname,
      phone: this.props.userReducer.user.phone,
      email: this.props.userReducer.user.email,
      user: this.props.userReducer.user,
    });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangePasswordSubmit(e) {
    e.preventDefault();
    const data = {
      password: this.state.newPassword,
    };
    this.props.auth_put_request("user/0/update_password", data, UPDATE_USER);
    // this.props.updateUser(data);
  }

  onUpdateSubmit(e) {
    e.preventDefault();
    const data = {
      name: this.state.name,
      surname: this.state.surname,
      phone: this.state.phone,
    };
    this.props.auth_put_request(
      "user/0/update_personal_info",
      data,
      UPDATE_USER
    );
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state);
  }

  render() {
    return (
      <Container className="accountMainPage">
        <Header />
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

          {/* <Grid item lg={2} md={2} sm={6} xs={12}>
              <Link className="nav-text" to="/account/ratings">
                Βαθμολογίες
              </Link>
            </Grid> */}
        </Grid>
        <Row className="userProfileRow bodyRow">
          <div className="roundedContainer userProfileContainer">
            <h4> Επεξεργασία Στοιχείων</h4>
            <Form onSubmit={this.onUpdateSubmit}>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridName">
                  <Form.Label>Όνομα</Form.Label>
                  <Form.Control
                    onChange={this.onChange}
                    type="text"
                    name="name"
                    value={this.state.name}
                    placeholder="Εισάγετε το όνομά σας"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridLastName">
                  <Form.Label>Επίθετο</Form.Label>
                  <Form.Control
                    onChange={this.onChange}
                    type="text"
                    name="surname"
                    value={this.state.surname}
                    placeholder="Εισάγετε το επίθετό σας"
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
                    placeholder="Εισάγετε το email σας"
                    readOnly
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridPhone">
                  <Form.Label>Τηλέφωνο Επικοινωνίας</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Εισάγετε τον αριθμό σας: 69xxxxxxxx"
                    name="phone"
                    pattern="69[0-9]{8}"
                    value={this.state.phone}
                    onChange={this.onChange}
                  />
                </Form.Group>
              </Form.Row>

              <Button variant="primary" type="submit">
                Ενημέρωση
              </Button>
            </Form>
          </div>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
});

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(
  connect(mapStateToProps, { auth_get_request, auth_put_request })(MainPage)
);
