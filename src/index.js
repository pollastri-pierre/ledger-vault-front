//@flow
//import "open-sans-fontface/open-sans.css";
import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import { Provider } from "react-redux";
import Container from "containers/Container";
import create from "redux/create";
import RestlayProvider from "restlay/RestlayProvider";
import GlobalLoading from "components/GlobalLoading";
import network from "network";
import theme from "styles/theme";

import I18nProvider from "containers/I18nProvider";

const muiTheme = createMuiTheme(theme);

const locale = window.localStorage.getItem("locale") || "en";

const store = create({ locale });

const $root = document.getElementById("root");

const render = Component => {
  $root &&
    ReactDOM.render(
      <Provider store={store}>
        <RestlayProvider
          network={network}
          connectDataOptDefaults={{ RenderLoading: GlobalLoading }}
        >
          <MuiThemeProvider theme={muiTheme}>
            <I18nProvider>
              <Component />
            </I18nProvider>
          </MuiThemeProvider>
        </RestlayProvider>
      </Provider>,
      $root
    );
};

render(Container);

if (module.hot) {
  module.hot.accept("./containers/Container", () => {
    const newContainer = require("containers/Container");
    render(newContainer);
  });
}
