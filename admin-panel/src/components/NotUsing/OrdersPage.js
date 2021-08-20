import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

class OrdersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: null,
      },
      isAuthenticated: false,
    };
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
  };

  componentDidMount() {
    console.log(this.props);
    this.setState({
      user: this.props.user,
      isAuthenticated: this.props.isAuthenticated,
    });
  }
  render() {
    return (
      <div>
        {!this.props.isAuthenticated ? (
          <div>
            <div>Welcome back {this.state.user.username}</div>
            <div>
              <Button type="primary">
                <Link to="/order_menu">Order now!</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div> You have to login to order!</div>
            <Button type="primary">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  isAuthenticated: state.userReducer.isAuthenticated,
});

export default connect(mapStateToProps, {})(OrdersPage);
