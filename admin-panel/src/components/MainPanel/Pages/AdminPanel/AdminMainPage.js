import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import "../../../../css/Pages/adminpage.css";

class AdminMainPage extends Component {
  componentDidMount() {
    console.log(this.state);
  }
  static propTypes = {};
  render() {
    return (
      <div className="adminPanel">
        <Grid container spacing={2}>
          <Grid item xs className="leftColMenu">
            <div className="menuItemContainer">
              <div className="menuItemText">Orders</div>
            </div>
            <div className="menuItemContainer">Users</div>
            <div className="menuItemContainer">Order!s</div>
            <div className="menuItemContainer">Order!s</div>
          </Grid>
          <Grid item xs={9} className="menuContainer">
            Container
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(AdminMainPage);
