import React from "react";
// CSS
import "../css/App/App.css";
// Routing
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomePage from "./Sections/Home/HomePage";
import OrderMainPage from "./Sections/Order/OrderMainPage";
import MainPage from "./Sections/Users/MainPage";
import Checkout from "./Sections/Order/Checkout";

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
import HomePage1 from "./Sections/Home/HomePage1";
import ShopPage from "./Sections/Order/ShopPage";
import Checkout1 from "./Sections/Order/Checkout1";
import AccountPage from "./Sections/Users/AccountPage";
import UserAddress1 from "./Sections/Users/UserAddress1";

const App = () => (
  <Router>
    <div className="min-h-screen relative">
      <SuccessSnackbar />
      <InfoSnackbar />
      <ErrorSnackbar />
      {/* <AlertsOverlay /> */}
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/home" component={HomePage1} />
        <Route path="/order/:category_name" component={OrderMainPage} />
        <Route path="/order1/:category_name" component={ShopPage} />
        <Route path="/order" component={OrderMainPage} />
        <Route exact path="/checkout/:id" component={Checkout} />
        <Route exact path="/checkout1/:id" component={Checkout1} />
        {/* <Route exact path="/search/:string" component={OrderMainPage} /> */}
        <Route exact path="/document/:type" component={TextPage} />
        <Route exact path="/account" component={MainPage} />
        <Route exact path="/account1" component={AccountPage} />
        {/* <Route exact path="orders" component={UserOrders1} /> */}
        <Route exact path="/account1/addresses" component={UserAddress1} />
        <Route exact path="/account/orders" component={UserOrders} />
        <Route exact path="/account/addresses" component={UserAddress} />
        <Route exact path="/account/ratings" component={UserRatings} />
        <Route exact path="*">
          <NotFound />
        </Route>
      </Switch>
    </div>
    <footer className="mt-4 text-center bg-gray-100 inset-x-0 absolute bottom-px">
      <p>
        (c) 2021 coffeetwist Με επιφύλαξη όλων των δικαιωμάτων.Όροι χρήσης,
        πολιτική ιδιωτικού απορρήτου.
      </p>
    </footer>
  </Router>
);

export default withAuthentication(App);
