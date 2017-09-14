import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Login } from '../../containers/Login/Login';
import { I18nProvider } from '../../containers';
import fakeStore from '../../utils/fakeStore';
import { initialState } from '../../redux/modules/auth';

import { TeamLogin, DeviceLogin } from '../../containers/Login/TeamLogin';
//
const getState = () => ({
  locale: 'en',
});

const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans, sans-serif',
});

injectTapEventPlugin();
const store = fakeStore(getState)
const translate = (str) => (str);

const noop = () => {};
const context = { translate: noop };
const step1 = mount(
  <Provider store={store}>
    <I18nProvider>
      <MuiThemeProvider muiTheme={muiTheme}>
        <Login
          auth={initialState}
          translate={noop}
          onFieldTeam={noop}
          onLogout={noop}
          onCloseTeamError={noop}
          onResetTeam={noop}
          onStartAuth={noop}
          history={{}}
        />
      </MuiThemeProvider>
    </I18nProvider>
  </Provider>
);


const validated = {...initialState, teamValidated: true};
const step2 = mount(
  <Provider store={store}>
    <I18nProvider>
      <MuiThemeProvider muiTheme={muiTheme}>
        <Login
          auth={validated}
          translate={noop}
          onFieldTeam={noop}
          onLogout={noop}
          onCloseTeamError={noop}
          onResetTeam={noop}
          onStartAuth={noop}
          history={{}}
        />
      </MuiThemeProvider>
    </I18nProvider>
  </Provider>
);


describe('Login container', () => {
  it('it should render TeamLogin at initialState', () => {
    expect(step1.find('TeamLogin').length).toBe(1);
    expect(step1.find('DeviceLogin').length).toBe(0);
  });

  it('it should render DeviceLogin at teamChecked ', () => {
    expect(step2.find('TeamLogin').length).toBe(0);
    expect(step2.find('DeviceLogin').length).toBe(1);
  });
});

