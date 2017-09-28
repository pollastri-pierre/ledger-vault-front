import React from 'react';
import { Redirect } from 'react-router';
import { shallow, render } from 'enzyme';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import fakeStore from '../../utils/fakeStore';
import { Logout } from '../../containers/Login/Logout';

describe('Logout container', () => {
  it('should be a redirect to /', () => {
    const logout = jest.fn();
    const wrapper = shallow(<Logout logout={logout} />);
    expect(wrapper.matchesElement(<Redirect to={{ pathname: '/' }} />)).toBe(true);
  });

  it('should call logout props on mount', () => {
    const logout = jest.fn();
    const history = createHistory();
    const getState = () => ({
      routing: { location: { } } });

    const store = fakeStore(getState);

    render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Logout logout={logout} />
        </ConnectedRouter>
      </Provider>,
    );
    expect(logout.mock.calls[0]).toBeDefined();
  });
});
