import React from 'react';
import { shallow, mount, render } from 'enzyme';
import fakeStore from '../../utils/fakeStore';
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter} from 'react-router-redux'
import { Provider } from 'react-redux';
import { Content } from '../../components';
import { Route } from 'react-router'

const getState = () => ({
  locale: 'fr',
  location: {history: {}}
});

const history = createHistory();
const translate = (str) => (str);

const store = fakeStore(getState)
const wrapper = mount(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Content />
    </ConnectedRouter>
  </Provider>
);

describe('Content', () => {
  it('should have a root Content class div ', () => {
    expect(wrapper.find('div.Content').length).toEqual(1);
  });

  it('first item should be a Route to sandbox', () => {
    const sandbox = wrapper.find('div.Content').childAt(0);
    expect(sandbox.type()).toEqual(Route);
    expect(sandbox.props().path).toEqual('/sandbox');
  });
});

