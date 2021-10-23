/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import "../../css/common/logregmodal.css";
import { login, login_async, register_async } from "../../actions/user";
import { returnErrors } from "../../actions/messages";
import PropTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";
import { showErrorSnackbar } from "../../actions/snackbar";
import { compose } from "recompose";
import { Google } from "react-bootstrap-icons";
import { withRouter } from "react-router";
import { withFirebase } from "../../firebase/base";

const tabs = [
  { name: "Σύνδεση", tab: "Login", href: "", current: false },
  { name: "Εγγραφή", tab: "Register", href: "", current: false },
];

class LoginRegisterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "Login",
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
    const res = await this.props.login_async(
      this.state.email,
      this.state.password,
      this.props.firebase
    );
    if (res === true) {
      this.onClose(false);
    }
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
    if (this.props.userReducer.isLoading) {
      return (
        <div>
          <div className="loading-div">
            <CircularProgress disableShrink />{" "}
          </div>
        </div>
      );
    }
    return (
      <div
        className={`fixed z-10 inset-0 overflow-y-auto ${
          this.props.open ? "" : "hidden"
        }`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`flex  justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ${
            this.props.open ? "" : "hidden"
          }`}
        >
          {/* <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    --> */}
          <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${
              this.props.open
                ? "ease-out duration-300 opacity-100"
                : "ease-in duration-200 opacity-0 hidden"
            }`}
            onClick={(e) => {
              this.onClose(false);
            }}
            aria-hidden="true"
          ></div>

          {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
          <span
            className="hidden inline-block align-middle h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {/* <!--
      Modal panel, show/hide based on modal state.

      
      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    --> */}
          <div
            className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
              this.props.open
                ? "ease-out duration-300 opacity-100 translate-y-0 sm:scale-100"
                : "ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            }`}
          >
            <div className="grid justify-items-end">
              <button
                type="submit"
                className="group  w-1/10   py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={(e) => {
                  this.onClose(false);
                }}
              >
                X
              </button>
            </div>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {/* <!-- Tabs --> */}
              <ul id="tabs" className="flex w-full px-1 pt-2 align-middle ">
                {tabs.map((t) => (
                  <li
                    className={`px-4 flex-1 text-center py-2 -mb-px font-semibold text-gray-800 border-b-2 border-blue-400 rounded-t opacity-50 ${
                      this.state.selectedTab === t.tab
                        ? "border-blue-400 border-b-4 -mb-px opacity-100"
                        : ""
                    }`}
                    onClick={() => this.onChangeTab(t.tab)}
                  >
                    {t.name}
                  </li>
                ))}
              </ul>

              {/* <!-- Tab Contents --> */}
              <div id="tab-contents">
                <div
                  id="Σύνδεση"
                  className={`p-4 ${
                    this.state.selectedTab === "Register" ? "hidden" : ""
                  }`}
                >
                  <LoginForm
                    email={this.state.email}
                    password={this.state.email}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}
                  />
                </div>
                <div
                  id="Εγγραφή"
                  className={`p-4 ${
                    this.state.selectedTab === "Login" ? "hidden" : ""
                  }`}
                >
                  <RegisterForm
                    email={this.state.email}
                    password={this.state.reg_password}
                    password2={this.state.reg_password2}
                    onChange={this.onChange}
                    onSubmit={this.onSubmitRegister}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
})(LoginRegisterModal);

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

const LoginForm = ({ onChange, onSubmit, email, password }) => {
  return (
    <div className="max-w-md w-full space-y-8">
      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              onChange={onChange}
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email "
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              onChange={onChange}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Σύνδεση
          </button>
        </div>
      </form>
    </div>
  );
};

const RegisterForm = ({ onChange, onSubmit, email, password, passowrd2 }) => {
  return (
    <div className="max-w-md w-full space-y-8">
      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              onChange={onChange}
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email "
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="reg_password"
              type="password"
              autoComplete="current-password"
              required
              onChange={onChange}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Repear Password
            </label>
            <input
              id="password"
              name="reg_password2"
              type="password"
              autoComplete="current-password"
              required
              onChange={onChange}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Repear Password"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Εγγραφή
          </button>
        </div>
      </form>
    </div>
  );
};
