import { CircularProgress } from "@material-ui/core";
import React from "react";

import { AuthUserContext } from "./base";
import { withFirebase } from "./base";

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
        hasLoaded: false,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onIdTokenChanged(
        async (authUser) => {
          this.setState({ hasLoaded: true });
          if (authUser) {
            localStorage.setItem("authUser", JSON.stringify(authUser));
            const firToken =
              await this.props.firebase.auth.currentUser.getIdToken(true);
            localStorage.setItem("firToken", firToken);
            localStorage.setItem("isAuthenticated", true);
            this.setState({ authUser });
          } else {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("authUser");
            localStorage.removeItem("firToken");
            this.setState({ authUser: null });
          }
        }
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      const hasLoaded = this.state.hasLoaded;
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          {hasLoaded ? (
            <Component {...this.props} />
          ) : (
            <CircularProgress align="center">
              Refreshing Token...
            </CircularProgress>
          )}
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
