//@flow
import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import { Provider } from "react-redux";
import { AppContainer } from "react-hot-loader";
import injectTapEventPlugin from "react-tap-event-plugin";
import create from "redux/create";
import RestlayProvider from "restlay/RestlayProvider";
import GlobalLoading from "components/GlobalLoading";
import network from "network";
import theme from "styles/theme";
import OrganizationAppRouter from "containers/OrganizationAppRouter";
import I18nProvider from "containers/I18nProvider";
import jss from "jss";
import MuseoWoff from "assets/fonts/MuseoSans_500-webfont.woff";

jss
  .createStyleSheet({
    "@font-face": {
      "font-family": "Museo",
      src: [`url('${MuseoWoff}') format('woff')`]
    }
  })
  .attach();
injectTapEventPlugin(); // Required by Material-UI

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
            <MuiThemeProvider theme={muiTheme}>
              <I18nProvider>
                <Component />
              </I18nProvider>
            </MuiThemeProvider>
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
