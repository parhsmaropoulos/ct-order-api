import React, { Component } from "react";
// CSS
import "../css/App/App.css";
// Routing
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomePage from "./Sections/Home/HomePage";
import OrderMainPage from "./Sections/Order/OrderMainPage";
import MainPage from "./Sections/Users/MainPage";
import Checkout from "./Sections/Order/Checkout";

// Layout
import Footer from "./Layout/Footer";

// Pages
import UserOrders from "./Sections/Users/UserOrders";
import UserAddress from "./Sections/Users/UserAddress";
import UserRatings from "./Sections/Users/UserRatings";
import SuccessSnackbar from "./Logging/SnackBars/SuccessSnackbar";
import InfoSnackbar from "./Logging/SnackBars/InfoSnackbar";
import ErrorSnackbar from "./Logging/SnackBars/ErrorSnackbar";
import NotFound from "./Layout/NotFound";
import TextPage from "./Sections/Common/TextPage";
import withAuthentication from "../firebase/withAuthentication";

const App = () => (
  <Router>
    <div className="App">
      <SuccessSnackbar />
      <InfoSnackbar />
      <ErrorSnackbar />
      {/* <AlertsOverlay /> */}
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/home" component={HomePage} />
        <Route path="/order/:category_name" component={OrderMainPage} />
        <Route path="/order" component={OrderMainPage} />
        <Route exact path="/checkout/:id" component={Checkout} />
        {/* <Route exact path="/search/:string" component={OrderMainPage} /> */}
        <Route exact path="/document/:type" component={TextPage} />
        <Route exact path="/account" component={MainPage} />
        <Route exact path="/account/orders" component={UserOrders} />
        <Route exact path="/account/addresses" component={UserAddress} />
        <Route exact path="/account/ratings" component={UserRatings} />
        <Route exact path="*">
          <NotFound />
        </Route>
      </Switch>
      <Footer className="footer" />
    </div>
  </Router>
);

export default withAuthentication(App);
