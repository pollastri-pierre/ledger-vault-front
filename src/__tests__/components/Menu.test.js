import React from "react";
import { shallow, mount, render } from "enzyme";
import fakeStore from "../../utils/fakeStore";
import createHistory from "history/createBrowserHistory";
import { ConnectedRouter } from "react-router-redux";
import { Provider } from "react-redux";
import { Menu } from "../../components";
import { Link } from "react-router-dom";

const getState = () => ({
  locale: "fr",
  location: { history: {} }
});

const history = createHistory();
const translate = str => str;

const store = fakeStore(getState);
const noop = function(str) {
  return str;
};
const context = { translate: noop };

const props = {
  accounts: {
    accounts: null
  },
  pathname: "/",
  getAccounts: jest.fn()
};

const wrapper = mount(
  <Provider store={store}>
    <ConnectedRouter history={history}>{Menu(props, context)}</ConnectedRouter>
  </Provider>,
  { context }
);

describe("Menu", () => {
  it("should have a root Menu class div ", () => {
    expect(wrapper.find("div.Menu").length).toEqual(1);
  });

  it("should have a child main-menu class ul ", () => {
    expect(
      wrapper
        .find("div.Menu")
        .children()
        .find("ul.main-menu").length
    ).toEqual(1);
  });

  it("should have a 4 li items ", () => {
    expect(
      wrapper
        .find("div.Menu")
        .children()
        .find("ul.main-menu")
        .children()
        .find("li").length
    ).toEqual(4);
  });

  it("shouldnt have a AccountsMenu if accounts.accounts has a length == 0", () => {
    const wrapper = shallow(<Menu {...props} />, { context });
    expect(
      wrapper
        .find("div.Menu")
        .children()
        .find("AccountsMenu").length
    ).toBe(0);
  });

  it("should have a AccountsMenu if accounts.accounts has a length > 0", () => {
    const propsAccounts = {
      accounts: {
        accounts: [{}, {}]
      },
      pathname: "/",
      getAccounts: jest.fn()
    };

    const wrapperAccounts = shallow(<Menu {...propsAccounts} />, { context });
    expect(
      wrapperAccounts
        .find("div.Menu")
        .children()
        .find("AccountsMenu").length
    ).toBe(1);
  });

  it("should have a 4 li items with Link to  ", () => {
    const home = wrapper
      .find("div.Menu")
      .children()
      .find("ul.main-menu")
      .childAt(0)
      .children();
    const nnew = wrapper
      .find("div.Menu")
      .children()
      .find("ul.main-menu")
      .childAt(1)
      .children();
    const pending = wrapper
      .find("div.Menu")
      .children()
      .find("ul.main-menu")
      .childAt(2)
      .children()
      .at(0);
    const search = wrapper
      .find("div.Menu")
      .children()
      .find("ul.main-menu")
      .childAt(3)
      .children();

    expect(home.type()).toEqual(Link);
    expect(home.at(0).props().to).toEqual("/");
    expect(nnew.type()).toEqual(Link);
    expect(nnew.at(0).props().to).toEqual("/new");
    expect(pending.type()).toEqual(Link);
    expect(pending.at(0).props().to).toEqual("/pending");
    expect(search.type()).toEqual(Link);
    expect(search.at(0).props().to).toEqual("/search");
  });
});
