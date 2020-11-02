import "firebase/database";
import "./global.scss";

<<<<<<< HEAD
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import * as firebase from "firebase/app";
=======
import firebase from "firebase";
>>>>>>> master
import * as React from "react";
import { hot } from "react-hot-loader";
import { Route, Switch } from "react-router-dom";

import styles from "./App.scss";
import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";
import { Sidebar } from "./components/sidebar/sidebar";
import { UserProvider } from "./components/user/user_provider";
import { EditProfile } from "./pages/edit_profile/edit_profile";
import { Favours } from "./pages/favours/favours";
import { Home } from "./pages/home/home";
import { Marketplace } from "./pages/marketplace/marketplace";
import { Messaging } from "./pages/messaging/messaging";
import { NoMatch } from "./pages/nomatch/nomatch";
import { Profile } from "./pages/profile/profile";
import { Report } from "./pages/report/report";
import { Signin } from "./pages/signin/signin";

const firebaseConfig = {
  apiKey: "AIzaSyCOMjZi_fUKGx03H4ScXGxoiA8ru9R61pU",
  authDomain: "service-barter-comp4050.firebaseapp.com",
  databaseURL: "https://service-barter-comp4050.firebaseio.com",
  projectId: "service-barter-comp4050",
  storageBucket: "service-barter-comp4050.appspot.com",
  messagingSenderId: "889395434104",
  appId: "1:889395434104:web:fc44924538905e413b538d",
  measurementId: "G-25WF1SXZ5K",
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

  theme = createMuiTheme({
    typography: {
      fontFamily: `Roboto, sans-serif`,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
    },
    palette: {
      primary: {
        main: "#FF9C33",
      },
      secondary: {
        main: "#4e636a",
      },
    },
  });

  constructor(props) {
    super(props);
    this.state = { sidebarOpen: false };

    firebase.initializeApp(firebaseConfig);
  }

  render() {
    return (
      <ThemeProvider theme={this.theme}>
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

                <Route exact path="/home">
                  <Home />
                </Route>

                <Route path="/messaging">
                  <Messaging />
                </Route>

                <Route path="/profile">
                  <Profile />
                </Route>

                <Route path="/favours">
                  <Favours />
                </Route>

                <Route path="/report">
                  <Report />
                </Route>

                <Route path="/editProfile">
                  <EditProfile />
                </Route>

                <Route path="/signin">
                  <Signin />
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
      </ThemeProvider>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
