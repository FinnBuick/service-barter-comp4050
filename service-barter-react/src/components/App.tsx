import * as React from "react";
import { hot } from "react-hot-loader";
import { Sidebar } from './sidebar/sidebar'
import { Header } from './header/header'
import { Footer } from './footer/footer'
import { Content } from './content/content'
import "./../assets/scss/App.scss";

class App extends React.Component<Record<string, unknown>, undefined> {
  public render() {
    return (
      <div className="app">
        <div className="header">
          <Header/>
        </div>
        <div className="sidebar">
          <Sidebar/>
        </div>
        <div className="content">
          <Content/>
        </div>
        <div className="footer">
          <Footer/>
        </div>
      </div>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
