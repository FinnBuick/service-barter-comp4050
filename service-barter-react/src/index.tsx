import { StylesProvider } from "@material-ui/core/styles";
import * as React from "react";
import { CookiesProvider } from "react-cookie";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const rootEl = document.getElementById("root");

render(
  <BrowserRouter>
    <StylesProvider injectFirst>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </StylesProvider>
  </BrowserRouter>,
  rootEl,
);
