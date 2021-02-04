import React, { Component } from "react";
import { Col, Container, Row, Image, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import "../../css/Layout/footer.css";
import logo from "../../assets/Images/logo2.jpg";
import {
  ArrowRightCircle,
  Facebook,
  Instagram,
  Twitter,
} from "react-bootstrap-icons";
import PropTypes from "prop-types";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsletterEmail: "",
    };
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubscribe = () => {
    console.log("Email subscribed:" + this.state.newsletterEmail);
  };

  render() {
    return (
      <Container fluid={true} className="footerContainer">
        <Row id="footerRow">
          <Col className="logoCol">
            <Image src={logo} width={200} height={70} className="headerLogo" />
            <Row>
              <Col>
                <Facebook />
              </Col>
              <Col>
                <Instagram />
              </Col>
              <Col>
                <Twitter />
              </Col>
            </Row>
          </Col>
          <Col>
            <div className="newsLetter">
              <Form>
                <Form.Group>
                  <Form.Label>
                    Εγγραφή Newsletter{" "}
                    <ArrowRightCircle onClick={this.onSubscribe} />
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="newsletterEmail"
                    placeholder="Πληκρτρολογήστε το email σας εδώ."
                    onChange={this.onChange}
                  />
                  <Form.Text
                    id="newsletterWrongEmail"
                    style={{ visibility: "hidden", color: "red" }}
                  >
                    Το email δεν είναι έγκυρο.
                  </Form.Text>
                </Form.Group>
              </Form>
            </div>
          </Col>
          <Col className="menu1Col">
            <ul>
              <li>Όροι χρήσης</li>
              <li>Επικοινωνία</li>
              <li>Πως λειτουργεί</li>
              <li>Ποιοί Είμαστε</li>
            </ul>
          </Col>
          <Col className="menu2Col">
            <ul>
              <li>Πολιτική Προστασίας</li>
              <li>Πολιτική cookies</li>
              <li>Πολιτική Αξιολόγισης</li>
              <li>Πολιτική Απορίτου</li>
            </ul>
          </Col>
        </Row>
        <Row className="subFooterRow">
          <div className="subFooterContent">
            <p className="subFooterText">
              (c) 2021 coffeetwist Με επιφύλαξη όλων των δικαιωμάτων.Όροι
              χρήσης, πολιτική ιδιωτικού απορρήτου.
            </p>
          </div>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect()(Footer);
