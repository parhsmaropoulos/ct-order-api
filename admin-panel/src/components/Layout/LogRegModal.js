import React, { Component } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { Facebook, Google } from "react-bootstrap-icons";
import { connect } from "react-redux";
import "../../css/Layout/logregmodal.css";
import { login, register } from "../../actions/user";
import PropTypes from "prop-types";

class LogRegModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "login",
      email: "",
      password: "",
      password2: "",
      ready: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitRegister = this.onSubmitRegister.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
  }

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  componentDidMount() {
    // this.setState({ selectedTab: this.props.selectedTab });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.login(this.state.email, this.state.password);
  }

  onSubmitRegister(e) {
    e.preventDefault();
    if (this.state.password === this.state.password2) {
      const user = {
        email: this.state.email,
        password: this.state.password,
      };
      this.props.register(user);
    } else {
      return;
    }
  }

  onChangeTab = (key) => {
    this.setState({ selectedTab: key });
  };

  onClose = (e) => {
    console.log("e");
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
    if (!this.props.show) {
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
                <Form onSubmit={this.onSubmit}>
                  <Form.Group>
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
                  </Form.Group>
                  <div className="loginButtons">
                    <Button type="submit" variant="outline-primary">
                      Σύνδεση
                    </Button>
                  </div>
                </Form>
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
                <Form onSubmit={this.onSubmitRegister}>
                  <Form.Group>
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
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Repeat Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password2"
                      onChange={this.checkPasswords}
                      //   onBlur={this.checkPasswords}
                      placeholder="Password"
                    />
                    <Form.Text
                      id="passwordMatchText"
                      style={{ visibility: "hidden" }}
                      muted
                    >
                      Passwords does not match
                    </Form.Text>
                  </Form.Group>
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
                </Form>
              </Tab>
            </Tabs>
          </Container>
        </Modal.Body>
        <Modal.Footer id="modalFooter">
          <p>Συμφωνία με όρους/πολιτική/προυποθέσεις</p>
        </Modal.Footer>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.isAuthenticated,
});

export default connect(mapStateToProps, { login, register })(LogRegModal);
