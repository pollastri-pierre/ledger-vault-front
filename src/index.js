//@flow
import React from "react";
import ReactDOM from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import createHistory from "history/createBrowserHistory";
import { Switch, Route } from "react-router";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import App from "./containers/App/App";
import create from "./redux/create";
import registerServiceWorker from "./registerServiceWorker";

import {
  ModalsContainer,
  PrivateRoute,
  Login,
  LoginTest,
  Logout,
  AlertsContainer,
  I18nProvider
} from "./containers";

import "./styles/index.css";

const muiTheme = getMuiTheme({
  fontFamily: "Open Sans, sans-serif"
});

const history = createHistory();
const locale = window.localStorage.getItem("locale") || "en";

const store = create(history, { locale });

const $root = document.getElementById("root");

$root &&
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <I18nProvider>
          <div>
            <AlertsContainer />
            <ModalsContainer />
            <ConnectedRouter history={history}>
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/logintest" component={LoginTest} />
                <Route path="/logout" component={Logout} />
                <PrivateRoute path="/" component={App} />
              </Switch>
            </ConnectedRouter>
          </div>
        </I18nProvider>
      </MuiThemeProvider>
    </Provider>,
    $root
  );

registerServiceWorker();
