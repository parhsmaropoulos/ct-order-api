/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 * Footer Component Contains Search Bar and Menu Links.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/user";
import PropTypes from "prop-types";
import "../../css/Layout/header.css";
import logo from "../../assets/Images/transparent-logo.png";
import LoginRegister from "../Modals/LoginRegister";
import withAuthorization from "../../firebase/withAuthorization";
import { compose } from "recompose";

const navigationSignedIn = [
  { name: "Προφίλ", href: "account", current: false },
  { name: "Παραγγελίες", href: "account/orders", current: false },
  { name: "Διευθύνσεις", href: "account/addresses", current: false },
  { name: "Αποσύνδεση", href: "", current: false },
];

const navigationNotSignedIn = [
  { name: "Σύνδεση", href: "", current: false },
  { name: "Εγγραφή", href: "", current: false },
];

class Header1 extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      selectedLangeuage: "EN",
      searchText: "",
      focus: false,
      openLogReg: false,
      results: [],
      open: false,
      logedIn: false,
    };
  }

  static propTypes = {
    logout: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
  };

  onClose = (bool) => {
    this.props.onClose && this.props.onClose(bool);
  };

  onChangeLang(lang) {
    this.setState({ selectedLangeuage: lang });
  }

  logOut = async (bool) => {
    await this.props.firebase.signOut();
    this.props.onClose && this.props.onClose(bool);
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = (event) => {
    if (this.myRef.current && this.myRef.current.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };

  onCloseLog = (bool) => {
    this.setState({ openLogReg: bool });
  };
  render() {
    let authenticated =
      localStorage.getItem("isAuthenticated") === "true" ? true : false;
    return (
      <nav className="bg-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <a href="/home">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src={logo}
                    alt="logo"
                  />
                </a>
                <a href="/home">
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src={logo}
                    alt="logo"
                  />
                </a>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* <!-- Profile dropdown --> */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="hover:bg-gray-300 flex focus:outline-none "
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={this.handleToggle}
                  >
                    <i className="fas fa-bars"></i>
                  </button>
                </div>

                {/* <!--
                  Dropdown menu, show/hide based on menu state.
      
                  Entering: "transition ease-out duration-100"
                    From: "transform opacity-0 scale-95"
                    To: "transform opacity-100 scale-100"
                  Leaving: "transition ease-in duration-75"
                    From: "transform opacity-100 scale-100"
                    To: "transform opacity-0 scale-95"
                --> */}
                <div
                  className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${
                    this.state.open === false && "transform opacity-0 scale-95"
                  }`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabindex="-1"
                >
                  {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                  {authenticated === true
                    ? navigationSignedIn.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={
                            (item.current
                              ? "bg-gray-900 text-white"
                              : "block px-4 py-2 text-sm text-gray-700 bg-gray-100",
                            "block px-4 py-2 text-sm text-gray-700")
                          }
                          aria-current={item.current ? "page" : undefined}
                          onClick={
                            item.name === "Αποσύνδεση"
                              ? () => {
                                  this.logOut(false);
                                }
                              : null
                          }
                        >
                          {item.name}
                        </a>
                      ))
                    : navigationNotSignedIn.map((item) => (
                        <a
                          key={item.name}
                          href={null}
                          className={
                            (item.current
                              ? "bg-gray-900 text-white"
                              : "block px-4 py-2 text-sm text-gray-700 bg-gray-100",
                            "block px-4 py-2 text-sm text-gray-700")
                          }
                          aria-current={item.current ? "page" : undefined}
                          onClick={(e) => {
                            this.onCloseLog(true);
                          }}
                        >
                          {item.name}
                        </a>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoginRegister
          open={this.state.openLogReg}
          firebase={this.props.firebase}
          onClose={(bool) => this.onCloseLog(bool)}
        />
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  userReducer: state.userReducer,
  products: state.productReducer.products,
});

export default compose(
  connect(mapStateToProps, { logout }),
  withAuthorization(() => {
    return true;
  })
)(Header1);
