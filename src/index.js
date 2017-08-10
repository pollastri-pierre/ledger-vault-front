import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { BrowserRouter } from 'react-router-dom';
import reducers from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import I18nProvider from './I18nProvider';
import './index.css';
import setAuthorizationToken from './utils/setAuthorizationToken';
import { setCurrentUser } from './actions';

const loggerMiddleware = createLogger();

const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans, sans-serif',
});


// Create redux store
// eslint-disable-next-line
const store = createStore(
  reducers,
  compose(
    applyMiddleware(
      thunk,
      loggerMiddleware,
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),
);

if (localStorage.token) {
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
          <App />
        </BrowserRouter>
      </I18nProvider>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
