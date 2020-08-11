import * as React from "react";
import { render } from "react-dom";
import App from "./components/App";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const rootEl = document.getElementById("root");

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
, rootEl);
