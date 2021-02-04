import React, { Component } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Image,
  Nav,
  Navbar,
  NavDropdown,
  Row,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { connect } from "react-redux";
import "../../css/Layout/header.css";
import logo from "../../assets/Images/logo2.jpg";
import { Link } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLangeuage: "EN",
      searchText: "",
      focus: false,
      isAuthenticated: false,
    };
  }

  onClose = (e) => {
    console.log("e");
    this.props.onClose && this.props.onClose(e);
  };

  onChangeLang(lang) {
    this.setState({ selectedLangeuage: lang });
  }

  changeIconVisibility(bool) {
    let str = "";
    if (bool) {
      if (this.state.searchText === "") {
        str = "inline";
      } else {
        str = "none";
      }
    } else {
      str = "none";
    }
    document.getElementById("searchIcon").style.display = str;
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Container fluid className="headerContainer">
        <Row id="headerRow">
          <Col>
            <Link to="/">
              <Image
                src={logo}
                width={150}
                height={64}
                className="headerLogo"
              />
            </Link>
          </Col>
          <Col xs={6} md={6}>
            <div class="searchBar">
              <div class="icon" id="searchIcon">
                <Search />
              </div>
              <div class="input">
                <form class="inputForm">
                  <input
                    type="text"
                    placeholder="Search"
                    class="searchBarText"
                    name="searchText"
                    onChange={this.onChange}
                    onSelect={() => this.changeIconVisibility(false)}
                    onBlur={() => this.changeIconVisibility(true)}
                  />
                </form>
              </div>
            </div>
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
                  {this.state.isAuthenticated ? (
                    <Nav.Link href="/logout">Logout</Nav.Link>
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
                  {/* <Nav.Link
                        onClick={(e) => {
                          this.onClose(e);
                        }}
                      >
                        Register
                      </Nav.Link>
                    </Row> */}
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect()(Header);
