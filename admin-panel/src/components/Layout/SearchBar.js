import React, { Fragment, Component } from "react";

import { Dropdown } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "../../css/Layout/header.css";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLangeuage: "EN",
      searchText: "",
      focus: false,
      isAuthenticated: false,
      results: [],
    };
  }
  changeIconVisibility(bool) {
    let str = "";
    if (bool) {
      if (this.state.searchText === "") {
        str = "inline";
        this.setState({
          results: [],
        });
      } else {
        str = "none";
      }
    } else {
      str = "none";
    }
    document.getElementById("searchIcon").style.display = str;
  }
  
  onChange = (e) => {
    if (e.target.value !== null) {
      this.setState({
        results: this.props.products.filter((item) =>
          item.name.toLowerCase().includes(e.target.value.toLowerCase())
        ),
      });
    } else {
      this.setState({
        results: [],
      });
    }
    console.log(this.state.results);
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    products: PropTypes.array.isRequired,
  };
  render() {
    return (
      <div>
        <div className="searchBar">
          <div className="icon" id="searchIcon">
            <Search />
          </div>
          <div className="input">
            <form className="inputForm">
              <input
                type="text"
                placeholder="Search"
                className="searchBarText"
                autoComplete="false"
                name="searchText"
                onChange={this.onChange}
                onSelect={() => this.changeIconVisibility(false)}
                onBlur={() => this.changeIconVisibility(true)}
              />
            </form>
          </div>
        </div>
        {this.state.results.length > 0 ? (
          <div className="searchResults">
            <Dropdown>
              {this.state.results.map((item, index) => {
                if (index < 5) {
                  return (
                    <Dropdown.Item key={index}>
                      <p>{item.name}</p>
                    </Dropdown.Item>
                  );
                } else {
                  return <span></span>;
                }
              })}
            </Dropdown>
          </div>
        ) : (
          <Fragment></Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
  products: state.productReducer.products,
});

export default connect(mapStateToProps, {})(SearchBar);
