/**
 * Footer Component Contains Search Bar and Menu Links.
 */

import React, { Component } from "react";
import { Image, Nav, Navbar } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { connect } from "react-redux";
import { logout, refreshToken, logout_async } from "../../actions/user";
import PropTypes from "prop-types";
import "../../css/Layout/header.css";
import logo from "../../assets/Images/transparent-logo.png";
import { Link } from "react-router-dom";
import {
  Button,
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";
import { useContext } from "react";
import { AuthContext } from "../../firebase/AuthProvider";

class Header extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      selectedLangeuage: "EN",
      searchText: "",
      focus: false,
      isAuthenticated: "",
      results: [],
      open: false,
    };
  }

  static propTypes = {
    // isAuthenticated: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    logout_async: PropTypes.func.isRequired,
  };

  onClose = (e) => {
    // console.log("e");
    this.props.onClose && this.props.onClose(e);
  };

  onChangeLang(lang) {
    this.setState({ selectedLangeuage: lang });
  }

  async logOut() {
    this.props.logout_async();
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = (event) => {
    if (this.myRef.current && this.myRef.current.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };

  render() {
    let autheticated = sessionStorage.getItem("isAuthenticated");
    // if (autheticated === "true" && this.props.user === null) {
    //   this.props.refreshToken(this.props.refresh_token);
    // }
    if (window.location.href.endsWith("admin_login")) {
      return null;
    }
    return (
      <Grid container>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <Link to="/home">
            <Image src={logo} className="headerLogo" />
          </Link>
        </Grid>
        <Grid item xs={6} md={6}>
          {/* <SearchBar /> */}
        </Grid>
        <Grid item xs={2}>
          <Navbar>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                {/* <NavDropdown
                  title={this.state.selectedLangeuage}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item onSelect={() => this.onChangeLang("GR")}>
                    GR
                  </NavDropdown.Item>
                  <NavDropdown.Item onSelect={() => this.onChangeLang("EN")}>
                    EN
                  </NavDropdown.Item>
                </NavDropdown> */}
                {autheticated ? (
                  <Grid item xs={3}>
                    <Button
                      color="primary"
                      ref={this.myRef}
                      aria-controls={
                        this.state.open ? "menu-list-grow" : undefined
                      }
                      aria-haspopup="true"
                      onClick={this.handleToggle}
                    >
                      <PersonCircle />
                      Profile
                    </Button>
                    <Popper
                      open={this.state.open}
                      anchorEl={this.myRef.current}
                      role={undefined}
                      transition
                      disablePortal
                      style={{ zIndex: 10 }}
                    >
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin:
                              placement === "bottom"
                                ? "center top"
                                : "center bottom",
                          }}
                        >
                          <Paper>
                            <ClickAwayListener onClickAway={this.handleClose}>
                              <MenuList
                                autoFocusItem={this.state.open}
                                id="menu-list-grow"
                              >
                                <MenuItem onClick={this.handleClose}>
                                  <Link to="/account">My profile</Link>
                                </MenuItem>
                                <MenuItem onClick={this.handleClose}>
                                  <Link to="/account/orders">My orders</Link>
                                </MenuItem>
                                <MenuItem onClick={this.handleClose}>
                                  <Link to="/account/addresses">
                                    My addresses
                                  </Link>
                                </MenuItem>
                                <MenuItem onClick={this.handleClose}>
                                  <Link to="/account/ratings">My ratings</Link>
                                </MenuItem>
                                <MenuItem onClick={this.handleClose}>
                                  <Link
                                    to="/home"
                                    onClick={() => this.logOut()}
                                  >
                                    Logout
                                  </Link>
                                </MenuItem>
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </Grid>
                ) : (
                  // <Row style={{ marginLeft: 10 }}>
                  <Nav.Link
                    onClick={(e) => {
                      this.onClose(e);
                    }}
                  >
                    Login/Register
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  userID: sessionStorage.getItem("userID"),
  refresh_token: sessionStorage.getItem("refreshToken"),
  user: state.userReducer.user,
  products: state.productReducer.products,
});

export default connect(mapStateToProps, { logout, refreshToken, logout_async })(
  Header
);
