import React, { Component } from "react";
// CSS
import "../css/App/App.css";
import "../css/Panel/Sidebar.css";

// Routing
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
// Pages
import UsersPage from "./MainPanel/Pages/Users/UsersPage";
import StatsPage from "./MainPanel/Pages/Stats/StatsPage";
import CreatePage from "./MainPanel/Pages/Create/CreatePage";
import OrdersPage from "./MainPanel/Pages/Orders/OrdersPage";
import ItemsPage from "./MainPanel/Pages/Items/ItemsPage";
import HomePage from "./MainPanel/Pages/Home/HomePage";
import AllUsersPage from "./MainPanel/Pages/Users/AllUsersPage";
import OrderMainPage from "./MainPanel/Pages/Orders/OrderMainPage";
import MainPage from "./MainPanel/Pages/Users/ProfilePages/MainPage";
import SingleItemPage from "./MainPanel/Pages/Items/SingleItemPage";
import PreCompleteOrderPage from "./MainPanel/Pages/Orders/PreCompleteOrderPage";

// Layout
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import LogRegModal from "./Layout/LogRegModal";

// Socket.io
// import { connect, sendMsg } from "../socket";

// redux

// Error/Alerts
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import { Container } from "react-bootstrap";
import UserOrders from "./MainPanel/Pages/Users/ProfilePages/UserOrders";
import UserAddress from "./MainPanel/Pages/Users/ProfilePages/UserAddress";
import UserRatings from "./MainPanel/Pages/Users/ProfilePages/UserRatings";
import AdminMainPage from "./MainPanel/Pages/AdminPanel/AdminMainPage";
import SingleIngredientPage from "./MainPanel/Pages/Items/SingleIngredientPage";
import PrivateRoute from "./MainPanel/Pages/Home/PrivateRoute";
import SuccessSnackbar from "./Layout/SnackBars/SuccessSnackbar";
import InfoSnackbar from "./Layout/SnackBars/InfoSnackbar";
import ErrorSnackbar from "./Layout/SnackBars/ErrorSnackbar";
import NotFound from "./Layout/NotFound";
import SingleChoicePage from "./MainPanel/Pages/Items/SingleChoicePage";

const alertOptions = {
  timeout: 3000,
  position: "top center",
};

// const routes = [
//   {
//     path: "/home",
//     component: HomePage,
//   },
//   {
//     path: "/",
//     component: HomePage,
//   },
//   {
//     path: "/items",
//     component: ItemsPage,
//   },
//   {
//     path: "/ingredients",
//     component: ItemsPage,
//   },
//   {
//     path: "/choices",
//     component: ItemsPage,
//   },
//   {
//     path: "/order",
//     component: OrderMainPage,
//   },
//   {
//     path: "/pre_complete",
//     component: PreCompleteOrderPage,
//   },
// ];

// function RouteWithSubRoutes(route) {
//   return (
//     <Route
//       path={route.path}
//       component={route.Component}
//       // render={(props) => (
//       //   // pass the sub-routes down to keep nesting
//       //   <route.component {...props} routes={route.routes} />
//       // )}
//     />
//   );
// }

class App extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      sideNavBarWidht: 0,
      showModal: false,
    };
    this.onChange = this.onChange.bind(this);
    this.sideNavBar = React.createRef();
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
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Header onClose={this.showModal} />
            <LogRegModal onClose={this.showModal} show={this.state.showModal} />
            {/* <AlertsOverlay /> */}
            <Container fluid id="Panel">
              <Switch>
                {/* {routes.map((route, i) => (
                  <RouteWithSubRoutes key={i} {...route} />
                ))} */}
                {/* PUBLIC ROUTES */}
                <Route path="/home" component={HomePage} />
                <Route path="/items" component={ItemsPage} />
                <Route path="/ingredients" component={ItemsPage} />
                <Route path="/choices" component={ItemsPage} />
                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
                <Route path="/order" component={OrderMainPage} />
                <Route path="/pre_complete" component={PreCompleteOrderPage} />
                {/* ADMIN ROUTES */}
                <Route path="/admin" component={AdminMainPage} />
                <Route path="/orders" component={OrdersPage} />
                <Route path="/users" component={UsersPage} />

                <Route path="/single_item" component={SingleItemPage} />
                <Route
                  path="/single_ingredient"
                  component={SingleIngredientPage}
                />
                <Route path="/single_choice" component={SingleChoicePage} />
                {/* PRIVATE ROUTES */}
                <PrivateRoute path="/stats" component={StatsPage} />
                <PrivateRoute path="/create_item" component={CreatePage} />
                <PrivateRoute path="/all_users" component={AllUsersPage} />
                {/* <Route path="/order_menu" component={OrderMenuPage} /> */}
                <PrivateRoute exact path="/account" component={MainPage} />
                <PrivateRoute
                  exact
                  path="/account/orders"
                  component={UserOrders}
                />
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
          </Router>
        </AlertProvider>
      </div>
    );
  }
}

export default App;
