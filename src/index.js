import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import reducers from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans, sans-serif',
});

// Create redux store
// eslint-disable-next-line
let store = createStore(reducers);

ReactDOM.render(
  // Pass the store to every components
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
