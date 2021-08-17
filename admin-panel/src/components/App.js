import React, { Component } from "react";
// CSS
import "../css/App/App.css";
// import "../css/Panel/Sidebar.css";

// Routing
import PrivateRoute from "./Sections/Common/PrivateRoute";
import {
  Route,
  // BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
// import { createBrowserHistory } from "history";

// Pages
// import UsersPage from "./Sections/Users/
import CreatePage from "./Sections/Create/CreatePage";
import StatsPage from "./Sections/Admin/Stats/StatsPage";
// import OrdersPage from "./Sections/Order/OrdersPage";

import ItemsPage from "./Sections/View/ItemsPage";
import HomePage from "./Sections/Home/HomePage";
import AllUsersPage from "./NotUsing/users/AllUsersPage";
import OrderMainPage from "./Sections/Order/OrderMainPage";
import MainPage from "./Sections/Users/MainPage";
import SingleItemPage from "./Sections/View/Products/SingleItemPage";
import PreCompleteOrderPage from "./Sections/Order/PreCompleteOrderPage";

// Layout
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import LogRegModal from "./Modals/LogRegModal";

// Socket.io
// import { connect, sendMsg } from "../socket";

// redux

// Error/Alerts
// import { Provider as AlertProvider } from "react-alert";
// import AlertTemplate from "react-alert-template-basic";

// import { Container } from "react-bootstrap";
import UserOrders from "./Sections/Users/UserOrders";
import UserAddress from "./Sections/Users/UserAddress";
import UserRatings from "./Sections/Users/UserRatings";
import AdminMainPage from "./Sections/Admin/AdminMainPage";
import SingleIngredientPage from "./Sections/View/Ingredients/SingleIngredientPage";
import SuccessSnackbar from "./Logging/SnackBars/SuccessSnackbar";
import InfoSnackbar from "./Logging/SnackBars/InfoSnackbar";
import ErrorSnackbar from "./Logging/SnackBars/ErrorSnackbar";
import NotFound from "./Layout/NotFound";
import SingleChoicePage from "./Sections/View/Choices/SingleChoicePage";
import TextPage from "./Sections/Common/TextPage";
import AllComents from "./Sections/Admin/Comments/AllComents";
import { Container } from "@material-ui/core";
import AdminLogInPage from "./Sections/Admin/AdminLogInPage";

// const alertOptions = {
//   timeout: 3000,
//   position: "top center",
// };

// const customHistory = createBrowserHistory();

class App extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      showModal: false,
    };
    this.onChange = this.onChange.bind(this);
    this.showModal = this.showModal.bind(this);
    // this.sendMessage = this.sendMessage.bind(this);
  }

  showModal = (e) => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  componentDidMount() {}
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="App">
        <SuccessSnackbar />
        <InfoSnackbar />
        <ErrorSnackbar />
        {/* <Router history={customHistory}> */}
        <Header onClose={this.showModal} />
        <LogRegModal onClose={this.showModal} show={this.state.showModal} />
        {/* <AlertsOverlay /> */}
        <Container id="Panel">
          <Switch>
            {/* PUBLIC ROUTES */}
            <Route path="/home" component={HomePage} />
            <PrivateRoute path="/items" component={ItemsPage} />
            <PrivateRoute path="/ingredients" component={ItemsPage} />
            <PrivateRoute path="/choices" component={ItemsPage} />
            <Route path="/login" component={LogRegModal} />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <PrivateRoute exact path="/order" component={OrderMainPage} />
            <PrivateRoute
              path="/pre_complete/:id"
              component={PreCompleteOrderPage}
            />
            <Route path="/search/:string" component={OrderMainPage} />
            {/* ADMIN ROUTES */}
            <Route path="/admin_login" component={AdminLogInPage} />
            <Route path="/admin" component={AdminMainPage} />
            {/* <Route path="/orders" component={OrdersPage} /> */}
            {/* <Route path="/users" component={UsersPage} /> */}

            <PrivateRoute path="/single_item" component={SingleItemPage} />
            <PrivateRoute
              path="/single_ingredient"
              component={SingleIngredientPage}
            />
            <PrivateRoute path="/single_choice" component={SingleChoicePage} />
            <Route path="/document/:type" component={TextPage} />
            <PrivateRoute path="/comments" component={AllComents} />
            <Route path="/stats/:id" component={StatsPage} />
            <PrivateRoute path="/create_item" component={CreatePage} />
            <Route path="/all_users" component={AllUsersPage} />
            {/* PRIVATE ROUTES */}
            {/* <Route path="/order_menu" component={OrderMenuPage} /> */}
            <PrivateRoute exact path="/account" component={MainPage} />
            <PrivateRoute exact path="/account/orders" component={UserOrders} />
            <PrivateRoute
              exact
              path="/account/addresses"
              component={UserAddress}
            />
            <PrivateRoute
              exact
              path="/account/ratings"
              component={UserRatings}
            />
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Container>
        <Footer className="footer" />
        {/* </Router> */}
      </div>
    );
  }
}

export default App;
