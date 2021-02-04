import React, { Component, PropTypes } from "react";
// import { Nav, Navbar } from "react-bootstrap";
import { SideNavBarData } from "./SideNavBarData";
import { Link } from "react-router-dom";
import { options } from "../../utils/util";

import "../../css/Panel/Sidebar.css";

// const logo = require("../../utils/Images/skull.jpg");

class SideNavBar extends Component {
  render() {
    return (
      <div className="Sidebar">
        <div className="Sidebarlogo">
          <div className="row">
            <img width={64} height={64} className="mr-3" />
            <div>
              <div id="title">{options.ShopTitle}</div>
              <div id="subtitle">{options.ShopSubTitle}</div>
            </div>
          </div>
        </div>
        <ul className="Sidebarlist">
          {SideNavBarData.map((val, key) => {
            return (
              <Link
                key={key}
                className="row"
                to={val.link}
                id={window.location.pathname === val.link ? "active" : ""}
              >
                {" "}
                <div id="icon">{val.icon}</div>
                <div id="title">{val.title}</div>
              </Link>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default SideNavBar;
