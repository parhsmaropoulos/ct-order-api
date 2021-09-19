import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import "../../../css/Pages/accountpage.css";
import { Container, Grid } from "@material-ui/core";
class UserRatings extends Component {
  static propTypes = {
    userReducer: PropTypes.object.isRequired,
  };

  componentDidMount() {}

  render() {
    return (
      <Container className="accountMainPage">
        <Row className="headerRow">
          <Grid spacing={3} container>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Link className="nav-text" to="/account">
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
              <Link
                className="nav-text  nav-text-activated"
                to="/account/ratings"
              >
                Βαθμολογίες
              </Link>
            </Grid> */}
          </Grid>
        </Row>
        <Row className="userRatingsRow bodyRow"></Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {})(UserRatings);
