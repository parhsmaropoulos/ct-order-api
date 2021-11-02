/**
 * Footer Component Contains Search Bar and Menu Links.
 */

import React, { Component } from "react";
import { Image, Nav, Navbar } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { connect } from "react-redux";
import { logout } from "../../actions/user";
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
  Typography,
} from "@material-ui/core";
import LogRegModal from "../Modals/LogRegModal";
import withAuthorization from "../../firebase/withAuthorization";
import { compose } from "recompose";

class Header extends Component {
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

    let modal = (
      <LogRegModal
        open={this.state.openLogReg}
        firebase={this.props.firebase}
        onClose={(bool) => this.onCloseLog(bool)}
      />
    );
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
                {authenticated === true ? (
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
                      Λογαριασμός
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
                                  <Link to="/account">Λογαριασμός</Link>
                                </MenuItem>
                                <MenuItem onClick={this.handleClose}>
                                  <Link to="/account/orders">Παραγγελίες</Link>
                                </MenuItem>
                                <MenuItem onClick={this.handleClose}>
                                  <Link to="/account/addresses">
                                    Διευθύνσεις
                                  </Link>
                                </MenuItem>
                                {/* <MenuItem onClick={this.handleClose}>
                                  <Link to="/account/ratings">Βαθμολογίες</Link>
                                </MenuItem> */}
                                <MenuItem
                                  onClick={() => {
                                    this.logOut(false);
                                  }}
                                >
                                  <Typography to="/home">Αποσύνδεση</Typography>
                                </MenuItem>
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </Grid>
                ) : (
                  <Nav.Link
                    onClick={(e) => {
                      this.onCloseLog(true);
                    }}
                  >
                    Σύνδεση/Εγγραφή
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Grid>
        <Grid item xs={1}></Grid>
        {modal}
      </Grid>
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
)(Header);