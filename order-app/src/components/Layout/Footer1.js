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
          <div className="flex flex-wrap justify-center gap-2">
            <a href="https://www.facebook.com/coffeetwistt">
              <button className="bg-blue-500 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded">
                <svg
                  className="w-5 h-5 fill-current"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </a>
            <a href="https://instagram.com/coffee_twist_">
              <button className="bg-blue-500 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded">
                <svg
                  // className="svg-inline--fa fa-instagram"
                  className="w-5 h-5 fill-current"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    // fill="currentColor"
                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                  />
                </svg>
              </button>
            </a>
          </div>
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
