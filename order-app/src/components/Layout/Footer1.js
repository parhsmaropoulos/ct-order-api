/**
 * Footer Component Contains Subscription Logic
 * and all the needed links to pages/text we need.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import "../../css/Layout/footer.css";
import { SocialIcon } from "react-social-icons";
import PropTypes from "prop-types";
import { subscribe } from "../../actions/user";
import { Link } from "react-router-dom";
import { auth_post_request } from "../../actions/lib";
import { SUBSCRIBE_USER } from "../../actions/actions";

class Footer1 extends Component {
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
    // isAuthenticated: PropTypes.bool,
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

  async onSubscribe() {
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
      const res = await auth_post_request(
        "subscribes/new",
        data,
        SUBSCRIBE_USER
      );
      console.log(res);
      // this.props.subscribe(data);
      this.setState({ newsletterEmail: "" });
    } else {
      document.getElementById("inputNewsLetterHelperText").style.display =
        "block";
    }
  }

  render() {
    return (
      <footer className="grid  relative sm:grid-cols-2 sm:grid-rows-2 md:grid-cols-4 bg:grid-cols-4 gap-4">
        {/* 
             ########################## Upper Row ################################
           */}
        {/* 
             ########################## Logo Column ################################
           */}
        <div>
          {/* <image src={logo} className="h-auto" /> */}
          <br />
          <SocialIcon
            style={{ height: 40, width: 40, marginRight: 10 }}
            url="https://www.facebook.com/coffeetwistt"
          />
          <SocialIcon
            style={{ height: 40, width: 40, marginLeft: 20 }}
            url="https://instagram.com/coffee_twist_"
          />
        </div>
        {/* 
             ########################## News Letter Column ################################
           */}
        <div>
          <label
            for="newsLetterEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Εγγραφή NewsLetter
          </label>
          <div className="mt-1 w-1/2 rounded-md shadow-sm">
            <input
              type="email"
              name="newsLetterEmail"
              id="newsLetterEmail"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="mail@example.com"
            />
          </div>
        </div>
        {/* 
             ########################## First Menu Column ################################
           */}
        <div>
          <ul style={{ listStyleType: "none" }}>
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
        </div>
        {/* 
             ########################## Second Menu Column ################################
           */}
        <div>
          <ul style={{ listStyleType: "none" }}>
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
        </div>{" "}
      </footer>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { subscribe })(Footer1);
