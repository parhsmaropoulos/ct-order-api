/**
 * Footer Component Contains Search Bar and Menu Links.
 */

import React, { Component } from "react";
import {
  Col,
  Container,
  Dropdown,
  Image,
  Nav,
  Navbar,
  NavDropdown,
  Row,
} from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { connect } from "react-redux";
import { logout, refreshToken } from "../../actions/user";
import PropTypes from "prop-types";
import "../../css/Layout/header.css";
import logo from "../../assets/Images/transparent-logo.png";
import { Link } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLangeuage: "EN",
      searchText: "",
      focus: false,
      isAuthenticated: "",
      results: [],
    };
  }

  static propTypes = {
    // isAuthenticated: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
  };

  onClose = (e) => {
    // console.log("e");
    this.props.onClose && this.props.onClose(e);
  };

  onChangeLang(lang) {
    this.setState({ selectedLangeuage: lang });
  }

  logOut() {
    this.props.logout();
  }

  render() {
    let autheticated = sessionStorage.getItem("isAuthenticated");
    if (autheticated === "true") {
      autheticated = true;
    } else {
      autheticated = false;
    }
    if (autheticated === "true" && this.props.user === null) {
      this.props.refreshToken(this.props.refresh_token);
    }
    return (
      <Container fluid className="headerContainer">
        <Col>
          <Link to="/home">
            <Image src={logo} className="headerLogo" />
          </Link>
        </Col>
        <Col xs={6} md={6}>
          {/* <SearchBar /> */}
        </Col>
        <Col>
          <Navbar>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <NavDropdown
                  title={this.state.selectedLangeuage}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item onSelect={() => this.onChangeLang("GR")}>
                    GR
                  </NavDropdown.Item>
                  <NavDropdown.Item onSelect={() => this.onChangeLang("EN")}>
                    EN
                  </NavDropdown.Item>
                </NavDropdown>
                {autheticated ? (
                  <Row style={{ marginLeft: 10 }}>
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <PersonCircle />
                        Profile
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <ul>
                          <li className="header-menu-li">
                            <Link to="/account">My profile</Link>
                          </li>
                          <li className="header-menu-li">
                            <Link to="/account/orders">My orders</Link>
                          </li>
                          <li className="header-menu-li">
                            <Link to="/account/addresses">My addresses</Link>
                          </li>
                          <li className="header-menu-li">
                            <Link to="/account/ratings">My ratings</Link>
                          </li>
                          <li className="header-menu-li">
                            <Link to="/home" onClick={() => this.logOut()}>
                              Logout
                            </Link>
                          </li>
                        </ul>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Row>
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
        </Col>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  userID: sessionStorage.getItem("userID"),
  refresh_token: sessionStorage.getItem("refreshToken"),
  user: state.userReducer.user,
  products: state.productReducer.products,
});

export default connect(mapStateToProps, { logout, refreshToken })(Header);
