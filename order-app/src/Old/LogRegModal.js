import React, { Component } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { connect } from "react-redux";
import "../../css/common/logregmodal.css";
import { login, login_async, register_async } from "../../actions/user";
import { returnErrors } from "../../actions/messages";
import PropTypes from "prop-types";
import {
  CircularProgress,
  Grid,
  Modal,
  Paper,
  TextField,
} from "@material-ui/core";
import { showErrorSnackbar } from "../../actions/snackbar";
import { compose } from "recompose";
import { Google } from "react-bootstrap-icons";
import { withRouter } from "react-router";
import { withFirebase } from "../../firebase/base";

class LogRegModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "login",
      email: "",
      password: "",
      reg_password: "",
      reg_password2: "",
      ready: false,
      showError: true,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitRegister = this.onSubmitRegister.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
  }

  static propTypes = {
    login: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    showErrorSnackbar: PropTypes.func.isRequired,
    register_async: PropTypes.func.isRequired,
    login_async: PropTypes.func.isRequired,
    glogin_async: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.setState({
      email: "",
      password: "",
    });
  }

  async googleLogin(e) {
    e.preventDefault();
    await this.props.glogin_async();
  }

  async onSubmit(e) {
    e.preventDefault();
    await this.props.login_async(
      this.state.email,
      this.state.password,
      this.props.firebase
    );
  }

  async onSubmitRegister(e) {
    e.preventDefault();
    if (this.state.reg_password !== this.state.reg_password2) {
      this.props.showErrorSnackbar("Passwords does not match");
    } else {
      const user = {
        email: this.state.email,
        password: this.state.reg_password,
      };
      let res = await this.props.register_async(
        user.email,
        user.password,
        "email",
        this.props.firebase
      );
      console.log(res);
      // this.props.register(user);
    }
  }

  onChangeTab = (key) => {
    this.setState({ selectedTab: key });
  };

  onClose = (bool) => {
    this.props.onClose && this.props.onClose(bool);
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  checkPasswords = (e) => {
    e.preventDefault();
    if (this.state.reg_password !== this.state.reg_password2) {
      document.getElementById("passwordMatchText").style.visibility = "visible";
      this.setState({ ready: false });
    } else {
      document.getElementById("passwordMatchText").style.visibility = "hidden";
      this.setState({ ready: true });
    }
  };

  render() {
    let errorModal;
    if (this.props.userReducer.isLoading) {
      return (
        <div>
          <div className="loading-div">
            <CircularProgress disableShrink />{" "}
          </div>
        </div>
      );
    }
    if (this.props.open) {
      if (localStorage.getItem("isAuthenticated") === "true") {
        this.onClose(false);
      }
    }
    return (
      <Modal
        open={this.props.open}
        autoFocus={true}
        onClose={(e) => {
          this.onClose(false);
        }}
        className="log-reg-modal"
      >
        <Paper className="inner-paper">
          <Grid container className="modalHeader">
            <Grid item xs={4}></Grid>
            <Grid item xs={4} className="headerTitle">
              {this.state.selectedTab === "login" ? (
                <p>Είσοδος Coffee Twist</p>
              ) : (
                <p>Εγγραφή στο Coffee Twist</p>
              )}
            </Grid>
            <Grid xs={4} item className="closeButtonCol">
              <Button
                variant="secondary"
                onClick={(e) => {
                  this.onClose(false);
                }}
              >
                X
              </Button>
            </Grid>
          </Grid>
          <Grid container className="modalBody">
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
              <Tabs
                activeKey={this.state.selectedTab}
                onSelect={(k) => this.onChangeTab(k)}
                className="modalBodyTabs"
              >
                <Tab eventKey="login" title="Σύνδεση">
                  {/* <SignInGoogle /> */}
                  <hr />
                  <form onSubmit={this.onSubmit}>
                    <TextField
                      name="email"
                      id="log_email"
                      label="Email"
                      type="email"
                      autoComplete="section-login username"
                      placeholder="input@example.com"
                      onChange={this.onChange}
                      variant="outlined"
                      style={{ width: "100%", margin: "0.5%" }}
                    />
                    <TextField
                      name="password"
                      id="log_password"
                      label="Password"
                      type="password"
                      autoComplete="section-login password"
                      placeholder="Password"
                      onChange={this.onChange}
                      style={{ width: "100%", margin: "0.5%" }}
                      variant="outlined"
                    />
                    <div className="loginButtons">
                      <Button type="submit" variant="outline-primary">
                        Σύνδεση
                      </Button>
                    </div>
                  </form>
                </Tab>
                <Tab eventKey="register" title="Εγγραφή">
                  {/* <div className="loginButtons">
                    <Button variant="outline-secondary">
                      Register with facebook <Facebook />
                    </Button>
                    <br />
                    <Button variant="outline-secondary">
                      Register with gmail <Google />
                    </Button>
                  </div>
                  <div>
                    <p>Κείμενο για είσοδο/ εγγραφή ή λινκ</p>
                  </div> */}
                  <hr />
                  <form onSubmit={this.onSubmitRegister}>
                    <TextField
                      name="email"
                      id="reg_email"
                      label="Email"
                      type="email"
                      placeholder="input@example.com"
                      onChange={this.onChange}
                      variant="outlined"
                      style={{ width: "100%", margin: "0.5%" }}
                    />
                    <TextField
                      name="reg_password"
                      id="reg_pass"
                      label="Enter Password"
                      type="password"
                      autoComplete="section-login new-password"
                      placeholder="Password"
                      onChange={this.onChange}
                      style={{ width: "100%", margin: "0.5%" }}
                      variant="outlined"
                    />
                    <TextField
                      name="reg_password2"
                      id="reg_pass_2"
                      label="Repeat Password"
                      type="password"
                      autoComplete="section-login new-password2"
                      placeholder=" Repeat Password"
                      onChange={this.onChange}
                      style={{ width: "100%", margin: "0.5%" }}
                      variant="outlined"
                    />
                    <div className="loginButtons">
                      <Button
                        type="submit"
                        variant="outline-primary"
                        id="registerButton"
                      >
                        Εγγραφή
                      </Button>
                    </div>
                  </form>
                </Tab>
              </Tabs>
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
          <Grid id="modalFooter" eleveation={0}>
            <p>Συμφωνία με όρους/πολιτική/προυποθέσεις</p>
          </Grid>
          {errorModal}
        </Paper>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
  errorReducer: state.errorReducer,
});

export default connect(mapStateToProps, {
  login,
  returnErrors,
  showErrorSnackbar,
  register_async,
  login_async,
})(LogRegModal);

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = (event) => {
    this.props.firebase
      .signWithGoogle()
      .then((socialAuthUser) => {
        this.setState({ error: null });
        this.props.history.push("/home");
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <div className="loginButtons">
          <Button variant="outline-secondary" type="submit">
            Log in with gmail <Google />
          </Button>
        </div>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase);