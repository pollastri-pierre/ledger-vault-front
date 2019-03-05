import React from "react";
import thunk from "redux-thunk";
import { withOptions } from "@storybook/addon-options";
import { Provider } from "react-redux";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import { composeWithDevTools } from "redux-devtools-extension";
import JssProvider from "react-jss/lib/JssProvider";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import { withKnobs } from "@storybook/addon-knobs";
import { configure, addDecorator } from "@storybook/react";
import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware
} from "redux";
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName
} from "@material-ui/core/styles";

import network from "network";
import dataReducer from "redux/modules/data";
import CounterValues from "data/CounterValues";
import exchanges from "redux/modules/exchanges";
import theme, { styledTheme } from "styles/theme";
import i18n from "./i18n";

const createStore = () => {
  return reduxCreateStore(
    combineReducers({
      countervalues: CounterValues.reducer,
      exchanges,
      data: dataReducer
    }),
    {},
    composeWithDevTools(applyMiddleware(thunk))
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
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <StyledContainer>{story()}</StyledContainer>
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </MuiThemeProvider>
      </I18nextProvider>
    </Provider>
  </JssProvider>
));

addDecorator(
  withOptions({
    name: "Ledger Vault - UI",
    url: "https://github.com/LedgerHQ/ledger-vault-front"
  })
);

addDecorator(withKnobs);

const Container = ({ children, classes }) => (
  <div className={classes.container}>{children}</div>
);

const StyledContainer = withStyles({
  container: {
    "& *": {
      boxSizing: "border-box"
    }
  }
})(Container);

configure(loadStories, module);
