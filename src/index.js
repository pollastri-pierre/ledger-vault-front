//@flow
import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { AppContainer } from "react-hot-loader";
import create from "redux/create";
import RestlayProvider from "restlay/RestlayProvider";
import GlobalLoading from "components/GlobalLoading";
import network from "network";
import theme from "styles/theme";
import OrganizationAppRouter from "containers/OrganizationAppRouter";
import jss from "jss";
import MuseoWoff from "assets/fonts/MuseoSans_500-webfont.woff";
import CounterValues from "data/CounterValues";
import i18n from "./i18n";

jss
  .createStyleSheet({
    "@font-face": {
      "font-family": "Museo",
      src: [`url('${MuseoWoff}') format('woff')`]
    }
  })
  .attach();
// injectTapEventPlugin(); // Required by Material-UI

const muiTheme = createMuiTheme(theme);

const locale = window.localStorage.getItem("locale") || "en";

const store = create({ locale });

const $root = document.getElementById("root");

const render = Component => {
  $root &&
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <RestlayProvider
            network={network}
            connectDataOptDefaults={{ RenderLoading: GlobalLoading }}
          >
            <CounterValues.PollingProvider>
              <I18nextProvider i18n={i18n}>
                <MuiThemeProvider theme={muiTheme}>
                  <Component />
                </MuiThemeProvider>
              </I18nextProvider>
            </CounterValues.PollingProvider>
          </RestlayProvider>
        </Provider>
      </AppContainer>,
      $root
    );
};

render(OrganizationAppRouter);

if (module.hot) {
  module.hot.accept("containers/OrganizationAppRouter", () => {
    const nextContainer = require("containers/OrganizationAppRouter").default;
    render(nextContainer);
  });
}
