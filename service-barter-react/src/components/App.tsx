import * as React from "react";
import { hot } from "react-hot-loader";
import { Sidebar } from "./sidebar/sidebar";
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { Content } from "./content/content";
import styles from "./App.scss";

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
  }

  render() {
    return (
      <div className={styles.app}>
        <Sidebar open={this.state.sidebarOpen} setOpen={this.setSidebarOpen} />
        <div className={styles.header}>
          <Header toggleSidebar={this.toggleSidebar} />
        </div>
        <div className={styles.content}>
          <Content />
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
