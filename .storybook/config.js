import React, { Fragment } from "react";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import JssProvider from "react-jss/lib/JssProvider";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import { withKnobs } from "@storybook/addon-knobs";
import { create as createTheme } from "@storybook/theming";
import { configure, addDecorator, addParameters } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from "@material-ui/core/styles";

import logo from "assets/img/logo-black@3x.png";
import network from "network";
import dataReducer from "redux/modules/data";
import counterValues from "data/counterValues";
import exchanges from "redux/modules/exchanges";
import theme, { styledTheme } from "styles/theme";
import GlobalStyle from "components/GlobalStyle";
import i18n from "./i18n";

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

const muiTheme = createMuiTheme(theme);

const req = require.context("../src", true, /.stories.js$/);
const store = createStore();

const generateClassName = (a, b) => {
  return `${b.options.classNamePrefix}-${a.key}`;
};

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(story => (
  <JssProvider generateClassName={generateClassName}>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={styledTheme}>
            <BrowserRouter>{story()}</BrowserRouter>
          </ThemeProvider>
        </MuiThemeProvider>
      </I18nextProvider>
    </Provider>
  </JssProvider>
));

addDecorator(withKnobs);

addDecorator(storyFn => (
  <Fragment>
    <GlobalStyle />
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
