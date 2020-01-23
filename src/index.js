// @flow
import React from "react";
import ReactDOM from "react-dom";
import sortBy from "lodash/sortBy";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { AppContainer } from "react-hot-loader";
import { ThemeProvider } from "styled-components";
import create from "redux/create";
import RestlayProvider from "restlay/RestlayProvider";
import network from "network";
import theme, { styledTheme } from "styles/theme";
import OrganizationAppRouter from "containers/OrganizationAppRouter";
import { formatRawERC20 } from "utils/cryptoCurrencies";

import i18n from "./i18n";

import "./insertFontsTags";

const muiTheme = createMuiTheme(theme);
const locale = window.localStorage.getItem("locale") || "en";
const store = create({ locale });
const $root = document.getElementById("root");

const render = Component => {
  $root &&
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <RestlayProvider network={network}>
            <I18nextProvider i18n={i18n}>
              <MuiThemeProvider theme={muiTheme}>
                <ThemeProvider theme={styledTheme}>
                  <Component />
                </ThemeProvider>
              </MuiThemeProvider>
            </I18nextProvider>
          </RestlayProvider>
        </Provider>
      </AppContainer>,
      $root,
    );
};

if (window.config.ERC20_LIST === "dev") {
  import("data/erc20-list.dev.json").then(module => {
    storeTokenList(module.default);
    render(OrganizationAppRouter);
  });
} else {
  import("data/erc20-list.dev.json").then(module => {
    storeTokenList(module.default);
    render(OrganizationAppRouter);
  });
}

if (module.hot) {
  module.hot.accept("containers/OrganizationAppRouter", () => {
    const nextContainer = require("containers/OrganizationAppRouter").default;
    render(nextContainer);
  });
}

function storeTokenList(list) {
  window.erc20 = sortBy(
    formatRawERC20(list).filter(
      t => t.hsm_signature || t.hsm_account_parameters,
    ),
    "name",
  );
}
