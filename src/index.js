import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { BrowserRouter } from 'react-router-dom';
import reducers from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import I18nProvider from './I18nProvider';

import './index.css';

const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans, sans-serif',
});

// Create redux store
// eslint-disable-next-line
let store = createStore(reducers);

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
