import React from "react";
// CSS
import "../css/App/App.css";
// Routing
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Pages
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
import UserOrders1 from "./Sections/Users/UserOrders1";

const App = () => (
  <Router>
    <div className="min-h-screen">
      <SuccessSnackbar />
      <InfoSnackbar />
      <ErrorSnackbar />
      <Switch>
        <Route exact path="/" component={HomePage1} />
        <Route exact path="/home" component={HomePage1} />
        <Route path="/order/:category_name" component={ShopPage} />
        <Route path="/order" component={ShopPage} />
        <Route exact path="/checkout/:id" component={Checkout1} />
        <Route exact path="/document/:type" component={TextPage} />
        <Route exact path="/account" component={AccountPage} />
        <Route exact path="/account/orders" component={UserOrders1} />
        <Route exact path="/account/addresses" component={UserAddress1} />
        <Route exact path="*">
          <NotFound />
        </Route>
      </Switch>
    </div>
  </Router>
);

export default withAuthentication(App);
