import React, { Component } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { Facebook, Google } from "react-bootstrap-icons";
import { connect } from "react-redux";
import "../../css/common/logregmodal.css";
import { login, register } from "../../actions/user";
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
  }

  static propTypes = {
    login: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    showErrorSnackbar: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.setState({
      email: "",
      password: "",
    });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.email, this.state.password);
    this.props.login(this.state.email, this.state.password);
  }

  onSubmitRegister(e) {
    e.preventDefault();
    if (this.state.reg_password !== this.state.reg_password2) {
      this.props.showErrorSnackbar("Passwords does not match");
    } else {
      const user = {
        email: this.state.email,
        password: this.state.password,
      };
      this.props.register(user);
    }
  }

  onChangeTab = (key) => {
    this.setState({ selectedTab: key });
  };

  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
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
    if (this.props.userReducer.LoadisLoadingng) {
      return (
        <div>
          <div className="loading-div">
            <CircularProgress disableShrink />{" "}
          </div>
        </div>
      );
    }
    if (sessionStorage.getItem("isAuthenticated") === "true") {
      return null;
    }
    return (
      <Modal
        open={this.props.show}
        autoFocus={true}
        onClose={(e) => {
          this.onClose(e);
        }}
        // id="logregModal"
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
                  this.onClose(e);
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
                <Tab eventKey="login" title="Login">
                  <div className="loginButtons">
                    <Button variant="outline-secondary">
                      Log in with facebook <Facebook />
                    </Button>
                    <br />
                    <Button variant="outline-secondary">
                      {/* Log in with gmail <Gmail className="gmailLogo" /> */}
                      Log in with gmail <Google />
                    </Button>
                  </div>
                  <div>
                    <p>Κείμενο για είσοδο/ εγγραφή ή λινκ</p>
                  </div>
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
                <Tab eventKey="register" title="Register">
                  <div className="loginButtons">
                    <Button variant="outline-secondary">
                      Register with facebook <Facebook />
                    </Button>
                    <br />
                    <Button variant="outline-secondary">
                      {/* Log in with gmail <Gmail className="gmailLogo" /> */}
                      Register with gmail <Google />
                    </Button>
                  </div>
                  <div>
                    <p>Κείμενο για είσοδο/ εγγραφή ή λινκ</p>
                  </div>
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
  isAuthenticated: state.userReducer.isAuthenticated,
  errorReducer: state.errorReducer,
});

export default connect(mapStateToProps, {
  login,
  register,
  returnErrors,
  showErrorSnackbar,
})(LogRegModal);
