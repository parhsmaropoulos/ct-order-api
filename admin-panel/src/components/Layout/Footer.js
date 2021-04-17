import React, { Component } from "react";
import { Col, Container, Row, Image } from "react-bootstrap";
import { connect } from "react-redux";
import "../../css/Layout/footer.css";
import logo from "../../assets/Images/transparent-logo.png";
import { ArrowRightCircle } from "react-bootstrap-icons";
import { SocialIcon } from "react-social-icons";
import PropTypes from "prop-types";
import { FormHelperText, TextField } from "@material-ui/core";
import { subscribe } from "../../actions/user";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsletterEmail: "",
    };
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    subscribe: PropTypes.func.isRequired,
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubscribe = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.state.newsletterEmail)) {
      document.getElementById("inputNewsLetterHelperText").style.display =
        "none";
      document.getElementById("inputNewsLetterHelperText").style.color =
        "green";
      document.getElementById("inputNewsLetterHelperText").innerHTML =
        "Success";
      const data = {
        email: this.state.newsletterEmail,
      };
      this.props.subscribe(data);
      // console.log("Email subscribed:" + this.state.newsletterEmail);
      this.setState({ newsletterEmail: "" });
    } else {
      document.getElementById("inputNewsLetterHelperText").style.display =
        "block";
    }
  };

  render() {
    return (
      <Container fluid={true} className="footerContainer">
        <Row id="footerRow">
          <Col className="logoCol">
            <Image src={logo} className="headerLogo" />
            <Row>
              <Col>
                <SocialIcon
                  style={{ height: 40, width: 40 }}
                  url="https://www.facebook.com/coffeetwistt"
                />
              </Col>
              <Col>
                <SocialIcon
                  style={{ height: 40, width: 40 }}
                  url="https://instagram.com/coffee_twist_"
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <div className="newsLetter">
              <div className="newsLetterTitle">Εγγραφή Newsletter </div>
              <div className="newsLetterInput">
                <TextField
                  type="email"
                  name="newsletterEmail"
                  id="inputNewsLetter"
                  placeholder="Πληκτρολογήστε το email σας εδώ."
                  onChange={this.onChange}
                  helperText=""
                />{" "}
                <FormHelperText
                  style={{ display: "none", textAlign: "center", color: "red" }}
                  id="inputNewsLetterHelperText"
                >
                  Wrong email
                </FormHelperText>
                <ArrowRightCircle onClick={this.onSubscribe} />
              </div>
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
              <li>Πολιτική Αξιολόγησης</li>
              <li>Πολιτική Απορρήτου</li>
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

export default connect(mapStateToProps, { subscribe })(Footer);
