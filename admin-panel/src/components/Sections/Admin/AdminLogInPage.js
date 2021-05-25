import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { admin_login } from "../../../actions/user";
import { Redirect } from "react-router";

class AdminLoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  static propTypes = {
    adminReducer: PropTypes.object.isRequired,
    admin_login: PropTypes.func.isRequired,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    console.log(this.props.adminReducer);
  }
  render() {
    if (this.props.adminReducer.isLoading) {
      return (
        <div className="loading-div">
          <CircularProgress disableShrink />{" "}
        </div>
      );
    }
    if (sessionStorage.getItem("adminAuthenticated")) {
      return <Redirect to="/admin" />;
    }
    return (
      <Container style={{ minHeight: "70vh" }}>
        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={4} style={{ minHeight: "100%" }}>
            <Paper elevation={2} style={{ margin: "1em", textAlign: "center" }}>
              <form>
                <Typography>Admin Login</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      name="email"
                      autoComplete="true"
                      onChange={this.handleChange}
                      label="Email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="password"
                      type="password"
                      autoComplete="true"
                      onChange={this.handleChange}
                      label="Password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        this.props.admin_login(
                          this.state.email,
                          this.state.password
                        )
                      }
                    >
                      Login
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  adminReducer: state.adminReducer,
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, { admin_login })(AdminLoginPage);
