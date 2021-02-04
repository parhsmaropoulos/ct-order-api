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

// Layout
import Header from "./Layout/Header";

// Socket.io
// import { connectSocket, socket } from "../socket";

// redux
// import store from "../store";

// Error/Alerts
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { Alerts } from "./MainPanel/Pages/Alert/Alerts";
import SingleItemPage from "./MainPanel/Pages/Items/SingleItemPage";
import { Button, Container, Form } from "react-bootstrap";
import OrderMenuPage from "./MainPanel/Pages/Orders/OrderMenuPage";
import Footer from "./Layout/Footer";
import LogRegModal from "./Layout/LogRegModal";
import OrderMainPage from "./MainPanel/Pages/Orders/OrderMainPage";

const alertOptions = {
  timeout: 3000,
  position: "top center",
};

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

  componentDidMount() {
    // connectSocket((message) => {
    //   console.log(message);
    // });
    // console.log(this.sideNavBar.current);
    // this.setState({ sideNavBarWidht: this.sideNavBar.current.offsetWidth });
  }

  // sendMessage(e) {
  //   e.preventDefault();
  //   console.log("here");
  //   const msg = this.state.message;
  //   socket.emit("chat", msg);
  //   connectSocket((msg) => {
  //     socket.emit("chat", msg);
  //   });
  // }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="App">
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Header onClose={this.showModal} />
            <LogRegModal onClose={this.showModal} show={this.state.showModal} />

            {/* <SideNavBar ref={this.sideNavBar} /> */}
            <Switch>
              <Container fluid id="Panel">
                <Alerts />
                <Route path="/home" component={HomePage} />
                <Route path="/orders" component={OrdersPage} />
                <Route path="/users" component={UsersPage} />
                <Route path="/items" component={ItemsPage} />
                <Route path="/single_item" component={SingleItemPage} />
                <Route path="/stats" component={StatsPage} />
                <Route path="/create_item" component={CreatePage} />
                <Route path="/all_users" component={AllUsersPage} />
                {/* <Route path="/order_menu" component={OrderMenuPage} /> */}
                <Route path="/order" component={OrderMainPage} />
              </Container>
            </Switch>
            <Footer className="footer" />
          </Router>
        </AlertProvider>
      </div>
    );
  }
}

export default App;
