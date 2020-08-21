import "firebase/database";

import * as firebase from "firebase/app";
import * as React from "react";
import { hot } from "react-hot-loader";
import { Route, Switch } from "react-router-dom";

import styles from "./App.scss";
import { Footer } from "./footer/footer";
import { Header } from "./header/header";
import { Home } from "./home/home";
import { Messaging } from "./messaging/messaging";
import { NoMatch } from "./nomatch/nomatch";
import { Profile } from "./profile/profile";
import { Sidebar } from "./sidebar/sidebar";
import { Signup } from "./signup/signup";
import { UserProvider } from "./user/user_provider";

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

              <Route path="*">
                <NoMatch />
              </Route>

              <Route path="/signup">
                <Signup />
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
