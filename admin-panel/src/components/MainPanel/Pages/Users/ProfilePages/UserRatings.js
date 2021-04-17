import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Container, Nav, Navbar, Row } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import "../../../../../css/Pages/accountpage.css";
class UserRatings extends Component {
  static propTypes = {
    userReducer: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (this.props.userReducer.isAuthenticated === false) {
      return <Redirect to="/home" />;
    }
  }

  render() {
    if (this.props.userReducer.isAuthenticated === false) {
      return <Redirect to="/home" />;
    } else {
      return (
        <Container className="accountMainPage">
          <Row className="headerRow">
            <Navbar className="user-nav-bar">
              <Nav className="mr-auto">
                <Link className="nav-text" to="/account">
                  Ο λογαριασμός μου
                </Link>
                <Link className="nav-text" to="/account/orders">
                  Οι παραγγελίες μου
                </Link>
                <Link className="nav-text" to="/account/addresses">
                  Διευθύνσεις
                </Link>
                <Link
                  className="nav-text nav-text-activated"
                  to="/account/ratings"
                >
                  Βαθμολογίες
                </Link>
              </Nav>
            </Navbar>
          </Row>
          <Row className="userRatingsRow bodyRow"></Row>
        </Container>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {})(UserRatings);
