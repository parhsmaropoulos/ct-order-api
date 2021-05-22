/**
 * Footer Component Contains Subscription Logic
 * and all the needed links to pages/text we need.
 */

import React, { Component } from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import "../../css/Layout/footer.css";
import logo from "../../assets/Images/transparent-logo.png";
import { ArrowRightCircle } from "react-bootstrap-icons";
import { SocialIcon } from "react-social-icons";
import PropTypes from "prop-types";
import { FormHelperText, Grid, TextField } from "@material-ui/core";
import { subscribe } from "../../actions/user";
import { Link } from "react-router-dom";

class Footer extends Component {
  /**
   *
   * @param {*} props
   * Constructor that inherits the parent props.
   * State: {
   *           News letter email,
   * }
   *
   */
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

  /**
   * Input change event
   */

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  /**
   * On email subscription check if mail is valid throught regex
   */

  onSubscribe = () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
      <Grid container style={{ flexGrow: 1 }} className="footerRow">
        {/* 
            ########################## Upper Row ################################
          */}
        {/* 
            ########################## Logo Column ################################
          */}
        <Grid item lg={1} md={false} sm={false}></Grid>
        <Grid item lg={2} md={3} sm={12}>
          <Image src={logo} className="headerLogo" />
          <br />
          <SocialIcon
            style={{ height: 40, width: 40, marginRight: 10 }}
            url="https://www.facebook.com/coffeetwistt"
          />
          <SocialIcon
            style={{ height: 40, width: 40, marginLeft: 20 }}
            url="https://instagram.com/coffee_twist_"
          />
        </Grid>
        {/* 
            ########################## News Letter Column ################################
          */}
        <Grid item lg={3} md={3} sm={12}>
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
                style={{
                  display: "none",
                  textAlign: "center",
                  color: "red",
                }}
                id="inputNewsLetterHelperText"
              >
                Wrong email
              </FormHelperText>
              <ArrowRightCircle onClick={this.onSubscribe} />
            </div>
          </div>
        </Grid>
        {/* 
            ########################## First Menu Column ################################
          */}
        <Grid item lg={3} md={3} sm={12}>
          <ul>
            <Link to="/document/oroi_xrisis">
              <li>Όροι χρήσης</li>
            </Link>
            <Link to="/document/epikoinwnia">
              <li>Επικοινωνία</li>
            </Link>
            <Link to="/document/how_it_works">
              <li>Πως λειτουργεί</li>
            </Link>
            <Link to="/document/who_we_are">
              <li>Ποιοί Είμαστε</li>
            </Link>
          </ul>
        </Grid>
        {/* 
            ########################## Second Menu Column ################################
          */}
        <Grid item lg={3} md={3} sm={12}>
          <ul>
            <Link to="/document/protection">
              <li>Πολιτική Προστασίας</li>
            </Link>
            <Link to="/document/coockies">
              <li>Πολιτική cookies</li>
            </Link>
            <Link to="/document/ratings">
              <li>Πολιτική Αξιολόγησης</li>
            </Link>
            <Link to="/document/privacy_policy">
              <li>Πολιτική Απορρήτου</li>
            </Link>
          </ul>
        </Grid>

        {/* 
            ########################## Bottom Row ################################
          */}
        <Grid item xs={12} className="subFooterRow">
          <div className="subFooterContent">
            <p className="subFooterText">
              (c) 2021 coffeetwist Με επιφύλαξη όλων των δικαιωμάτων.Όροι
              χρήσης, πολιτική ιδιωτικού απορρήτου.
            </p>
          </div>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { subscribe })(Footer);
