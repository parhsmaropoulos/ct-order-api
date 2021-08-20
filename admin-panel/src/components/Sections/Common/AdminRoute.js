import React from "react";
import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../../firebase/AuthProvider";

const AdminRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        !!currentUser ? <Component {...props} /> : <Redirect to={"/home"} />
      }
    />
  );
};

export default AdminRoute;
