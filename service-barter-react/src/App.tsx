import "firebase/database";

import * as firebase from "firebase/app";
import * as React from "react";
import { hot } from "react-hot-loader";
import { Route, Switch } from "react-router-dom";

import styles from "./App.scss";
import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";
import { Sidebar } from "./components/sidebar/sidebar";
import { Signup } from "./components/signup/signup";
import { UserProvider } from "./components/user/user_provider";
import { Home } from "./pages/home/home";
import { Marketplace } from "./pages/marketplace/marketplace";
import { Messaging } from "./pages/messaging/messaging";
import { NoMatch } from "./pages/nomatch/nomatch";
import { Profile } from "./pages/profile/profile";

const firebaseConfig = {
  apiKey: "AIzaSyCkyJ2dzp6O64T-dZS5hsJlV94S7A0y5oc",
  authDomain: "service-barter-comp4050.firebaseapp.com",
  databaseURL: "https://service-barter-comp4050.firebaseio.com",
  projectId: "service-barter-comp4050",
};

class App extends React.Component<
  Record<string, unknown>,
  { sidebarOpen: boolean }
> {
  setSidebarOpen = (open: boolean) => {
    this.setState({ sidebarOpen: open });
  };

  toggleSidebar = () => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  };

  constructor(props) {
    super(props);
    this.state = { sidebarOpen: false };

    firebase.initializeApp(firebaseConfig);
  }

  render() {
    return (
      <UserProvider>
        <div className={styles.app}>
          <Sidebar
            open={this.state.sidebarOpen}
            setOpen={this.setSidebarOpen}
          />
          <div className={styles.header}>
            <Header toggleSidebar={this.toggleSidebar} />
          </div>
          <div className={styles.content}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>

              <Route path="/messaging">
                <Messaging />
              </Route>

              <Route path="/profile">
                <Profile />
              </Route>

              <Route path="/signup">
                <Signup />
              </Route>

              <Route path="/marketplace">
                <Marketplace />
              </Route>

              <Route path="*">
                <NoMatch />
              </Route>
            </Switch>
          </div>
          <div className={styles.footer}>
            <Footer />
          </div>
        </div>
      </UserProvider>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
