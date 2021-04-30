import React, { Component } from "react";
import { Button, Col, Container, Modal, Row, Tab, Tabs } from "react-bootstrap";
import { Facebook, Google } from "react-bootstrap-icons";
import { connect } from "react-redux";
import "../../css/Layout/logregmodal.css";
import { login, register } from "../../actions/user";
import { returnErrors } from "../../actions/messages";
import PropTypes from "prop-types";
import ClipLoader from "react-spinners/ClipLoader";
import { TextField } from "@material-ui/core";

class LogRegModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "login",
      email: "",
      password: "",
      password2: "",
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
  };

  componentDidMount() {
    this.setState({
      email: "",
      password: "",
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.login(this.state.email, this.state.password);
  }

  onSubmitRegister(e) {
    e.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.register(user);
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
    if (this.state.password !== e.target.value) {
      document.getElementById("passwordMatchText").style.visibility = "visible";
      this.setState({ ready: false });
    } else {
      document.getElementById("passwordMatchText").style.visibility = "hidden";
      this.setState({ ready: true });
    }
  };
  render() {
    let errorModal;
    if (!this.props.show) {
      return null;
    }
    if (this.props.userReducer.isAuthenticated) {
      return null;
    }
    return (
      <Modal
        show={true}
        autoFocus={true}
        scrollable={true}
        onHide={(e) => {
          this.onClose(e);
        }}
        id="logregModal"
      >
        <Modal.Header className="modalHeader">
          <Container fluid>
            <Row>
              <Col></Col>
              <Col xs={6} md={6} className="headerTitle">
                {this.state.selectedTab === "login" ? (
                  <p>Είσοδος Coffee Twist</p>
                ) : (
                  <p>Εγγραφή στο Coffee Twist</p>
                )}
              </Col>
              <Col className="closeButtonCol">
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    this.onClose(e);
                  }}
                >
                  X
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <Container fluid>
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
                  {/* <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="input@example.com"
                      onChange={this.onChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      onChange={this.onChange}
                      placeholder="Password"
                    />
                  </Form.Group> */}
                  <TextField
                    name="email"
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="input@example.com"
                    onChange={this.onChange}
                    variant="outlined"
                    style={{ width: "100%", margin: "0.5%" }}
                  />
                  <TextField
                    name="password"
                    id="password"
                    label="Password"
                    type="password"
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
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="input@example.com"
                    onChange={this.onChange}
                    variant="outlined"
                    style={{ width: "100%", margin: "0.5%" }}
                  />
                  <TextField
                    name="password"
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Password"
                    onChange={this.onChange}
                    style={{ width: "100%", margin: "0.5%" }}
                    variant="outlined"
                  />
                  <TextField
                    name="password2"
                    id="password2"
                    label="Password2"
                    type="password"
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
                      disabled={!this.state.ready}
                    >
                      Εγγραφή
                    </Button>
                  </div>
                </form>
              </Tab>
            </Tabs>
          </Container>
        </Modal.Body>
        <Modal.Footer id="modalFooter">
          <p>Συμφωνία με όρους/πολιτική/προυποθέσεις</p>
        </Modal.Footer>
        <ClipLoader
          color={"#ffffff"}
          loading={this.props.userReducer.isLoading}
        />
        {errorModal}
      </Modal>
    );
  }
}
const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
  isAuthenticated: state.userReducer.isAuthenticated,
  errorReducer: state.errorReducer,
});

export default connect(mapStateToProps, { login, register, returnErrors })(
  LogRegModal
);
