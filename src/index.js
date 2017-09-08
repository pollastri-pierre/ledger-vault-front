import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import create from './redux/create';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { ConnectedRouter} from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import App from './containers/App/App';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css';


const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans, sans-serif',
});

const history = createHistory();
const locale = window.localStorage.getItem('locale') || 'en';

let store = create(history, {
  locale: locale
});


// Get saved locale or fallback to english

ReactDOM.render(
  // Pass the store, muiTheme and i18n to every components
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
