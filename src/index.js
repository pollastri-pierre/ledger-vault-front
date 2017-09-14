import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import createHistory from 'history/createBrowserHistory';
import { Switch, Route } from 'react-router';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import App from './containers/App/App';
import create from './redux/create';
import registerServiceWorker from './registerServiceWorker';
import { PrivateRoute, Login, LoginTest, Logout, AlertsContainer, I18nProvider } from './containers';
import { getUserInfos } from './redux/modules/auth';

import './styles/index.css';


const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans, sans-serif',
});

const history = createHistory();
const locale = window.localStorage.getItem('locale') || 'en';

const store = create(history, { locale });

// Get saved locale or fallback to english
const token = window.localStorage.getItem('token');

const render = () => {
  ReactDOM.render(
    // Pass the store, muiTheme and i18n to every components
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <I18nProvider>
          <div>
            <AlertsContainer />
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
    document.getElementById('root'));
  registerServiceWorker();
};

if (token) {
  getUserInfos()(store.dispatch, store.getState).then(() => {
    render();
  }).catch(() => {
    render();
  });
} else {
  render();
}

