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

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <SideNavBar />
          <Switch>
            <div className="Panel">
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
      </div>
    );
  }
}

export default App;
