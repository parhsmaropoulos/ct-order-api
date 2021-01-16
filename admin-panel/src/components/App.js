import React, { Component } from "react";
import SideNavBar from "./SideNavBar/SideNavBar";
// CSS
import "../css/App/App.css";
import "../css/Panel/Sidebar.css";

// Routing
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

// Pages
import UsersPage from "./MainPanel/Pages/Users/UsersPage";
import StatsPage from "./MainPanel/Pages/Stats/StatsPage";
import CreatePage from "./MainPanel/Pages/Create/CreatePage";
import OrdersPage from "./MainPanel/Pages/Orders/OrdersPage";
import ItemsPage from "./MainPanel/Pages/Items/ItemsPage";
import HomePage from "./MainPanel/Pages/Home/HomePage";
import RegisterPage from "./MainPanel/Pages/Users/RegisterPage";
import LoginPage from "./MainPanel/Pages/Users/LoginPage";
import AllUsersPage from "./MainPanel/Pages/Users/AllUsersPage";

// redux
import store from "../store";

// Error/Alerts
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { Alerts } from "./MainPanel/Pages/Alert/Alerts";

const alertOptions = {
  timeout: 3000,
  position: "top center",
};

class App extends Component {
  componentDidMount() {
    // store.dispatch(loadUser);
  }
  render() {
    return (
      <div className="App">
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <SideNavBar />
            <Switch>
              <div className="Panel">
                <Alerts />
                <Route path="/#" component={HomePage} />
                <Route path="/orders" component={OrdersPage} />
                <Route path="/users" component={UsersPage} />
                <Route path="/items" component={ItemsPage} />
                <Route path="/stats" component={StatsPage} />
                <Route path="/create_item" component={CreatePage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/all_users" component={AllUsersPage} />
              </div>
            </Switch>
          </Router>
        </AlertProvider>
      </div>
    );
  }
}

export default App;
