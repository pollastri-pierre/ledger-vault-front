import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import reducers from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import I18nProvider from './I18nProvider';
import './index.css';
import setAuthorizationToken from './utils/setAuthorizationToken';
import { setCurrentUser } from './actions';
import PrivateRoute from './PrivateRoute';
import Login from './Login';
import Logintest from './Logintest';
import Tabtest from './Tabtest';


const loggerMiddleware = createLogger();

const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans, sans-serif',
});


// Create redux store
// eslint-disable-next-line
const store = createStore(
  reducers,
  compose(
    //autoRehydrate(),
    applyMiddleware(
      //loggerMiddleware,
      thunk,

    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),
);

//persistStore(store);


if (localStorage) { //TODO : timeout
  setAuthorizationToken(localStorage.token);
  store.dispatch(setCurrentUser(localStorage.token));
}

// Get saved locale or fallback to english
const locale = window.localStorage.getItem('locale') || 'en';

ReactDOM.render(
  // Pass the store, muiTheme and i18n to every components
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <I18nProvider locale={locale}>
        <BrowserRouter>
          <Switch>
            <Route path="/login/:email?" component={Login} />
            <Route path="/tabtest" component={Tabtest} />
            <Route path="/logintest" component={Logintest} />
            <PrivateRoute path="/" component={App} requiredLevel="all" />
          </Switch>
        </BrowserRouter>
      </I18nProvider>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
//persistStore(store).purge()

