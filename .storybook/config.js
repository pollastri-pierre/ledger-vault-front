import React, { Fragment } from "react";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { withKnobs } from "@storybook/addon-knobs";
import { create as createTheme } from "@storybook/theming";
import { configure, addDecorator, addParameters } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
} from "redux";

import logo from "assets/img/logo-black@3x.png";
import dataReducer from "redux/modules/data";
import counterValues from "data/counterValues";
import exchanges from "redux/modules/exchanges";
import { styledTheme } from "styles/theme";
import GlobalStyle from "components/GlobalStyle";
import i18n from "./i18n";
import "../device/registerTransports";

import erc20list from "data/erc20-list.dev.json";

window.erc20 = erc20list;

const createStore = () => {
  return reduxCreateStore(
    combineReducers({
      countervalues: counterValues.reducer,
      exchanges,
      data: dataReducer,
    }),
    {},
    composeWithDevTools(applyMiddleware(thunk)),
  );
};

const req = require.context("../src", true, /.stories.js$/);
const store = createStore();

const StorybookGlobalStyle = createGlobalStyle`
  body {
    padding: 20px;
  }
`;

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

addDecorator((story) => (
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={styledTheme}>
        <BrowserRouter>{story()}</BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>
  </Provider>
));

addDecorator(withKnobs);

addDecorator((storyFn) => (
  <Fragment>
    <GlobalStyle />
    <StorybookGlobalStyle />
    {storyFn()}
  </Fragment>
));

addParameters({
  options: {
    theme: createTheme({
      base: "light",
      brandTitle: "Ledger Vault UI",
      brandUrl: "https://github.com/LedgerHQ/ledger-vault-front",
      brandImage: logo,
    }),
    panelPosition: "bottom",
  },
});

configure(loadStories, module);
