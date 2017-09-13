import React from 'react';
import { shallow, mount, render } from 'enzyme';
import fakeStore from '../../utils/fakeStore';
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter} from 'react-router-redux'
import { Provider } from 'react-redux';
import { Menu } from '../../components';
import { Link } from 'react-router-dom';
import getElementWithContext from 'react-test-context-provider';

const getState = () => ({
  locale: 'fr',
  location: {history: {}}
});

const history = createHistory();
const translate = (str) => (str);

const store = fakeStore(getState)
const noop = function(str) { return str};
const context = { translate: noop };

const wrapper = mount(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {Menu({}, context)}
    </ConnectedRouter>
  </Provider>
, { context });

describe('Menu', () => {
  it('should have a root Menu class div ', () => {
    expect(wrapper.find('div.Menu').length).toEqual(1);
  });

  it('should have a child main-menu class ul ', () => {
    expect(wrapper.find('div.Menu').children().find('ul.main-menu').length).toEqual(1);
  });

  it('should have a 5 li items ', () => {
    expect(wrapper.find('div.Menu').children().find('ul.main-menu').children().find('li').length).toEqual(5);
  });

  it('should have a 5 li items with Link to  ', () => {
    const home = wrapper.find('div.Menu').children().find('ul.main-menu').childAt(0).children();
    const nnew = wrapper.find('div.Menu').children().find('ul.main-menu').childAt(1).children();
    const pending = wrapper.find('div.Menu').children().find('ul.main-menu').childAt(2).children().at(0);
    const search = wrapper.find('div.Menu').children().find('ul.main-menu').childAt(3).children();
    const sandbox = wrapper.find('div.Menu').children().find('ul.main-menu').childAt(4).children();

    expect(home.type()).toEqual(Link);
    expect(home.at(0).props().to).toEqual('/');
    expect(nnew.type()).toEqual(Link);
    expect(nnew.at(0).props().to).toEqual('/new');
    expect(pending.type()).toEqual(Link);
    expect(pending.at(0).props().to).toEqual('/pending');
    expect(search.type()).toEqual(Link);
    expect(search.at(0).props().to).toEqual('/search');
    expect(sandbox.type()).toEqual(Link);
    expect(sandbox.at(0).props().to).toEqual('/sandbox');
  });
});

