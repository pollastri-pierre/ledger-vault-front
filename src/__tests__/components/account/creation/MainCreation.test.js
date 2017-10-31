import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { shallow } from "enzyme";
import MainCreation from "../../../../components/accounts/creation/MainCreation";
import AccountCreationCurrencies from "../../../../components/accounts/creation/AccountCreationCurrencies";
import AccountCreationOptions from "../../../../components/accounts/creation/AccountCreationOptions";
import AccountCreationSecurity from "../../../../components/accounts/creation/AccountCreationSecurity";
import AccountCreationConfirmation from "../../../../components/accounts/creation/AccountCreationConfirmation";
import { Overscroll } from "../../../../components/";

describe("MainCreation Test", () => {
  const props = {
    close: jest.fn(),
    changeAccountName: jest.fn(),
    selectCurrency: jest.fn(),
    onSelect: jest.fn(),
    save: jest.fn(),
    switchInternalModal: jest.fn(),
    tabsIndex: 0,
    currencies: {
      isLoading: false,
      currencies: []
    },
    account: {
      options: {
        name: ""
      },
      security: {
        approvals: 0,
        members: []
      },
      currency: null
    }
  };

  it("should be a Tabs component", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    expect(wrapper.type()).toBe(Tabs);
  });

  it("the Tabs component should have a Header with h2", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");

    expect(header.find("h2").text()).toBe("New account");
  });

  it("First Tab in TabList should be currency", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");
    const tablist = header.find("TabList");
    expect(
      tablist
        .children()
        .at(0)
        .prop("children")
    ).toBe(" 1. Currency ");
  });

  it("Second Tab in TabList should be Options", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");
    const tablist = header.find("TabList");
    expect(
      tablist
        .children()
        .at(1)
        .prop("children")
    ).toBe("2. Options");
  });

  it("Third Tab in TabList should be Security", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");
    const tablist = header.find("TabList");
    expect(
      tablist
        .children()
        .at(2)
        .prop("children")
    ).toBe("3. Security");
  });

  it("Fourth Tab in TabList should be Confirmation", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");
    const tablist = header.find("TabList");
    expect(
      tablist
        .children()
        .at(3)
        .prop("children")
    ).toBe("4. Confirmation");
  });

  it("Second Tab should be disabled if no currency set", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");
    const tablist = header.find("TabList");
    expect(
      tablist
        .children()
        .at(1)
        .prop("disabled")
    ).toBe(true);
  });

  it("Second Tab should not be disabled if currency set", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        currency: {
          name: "bitcoin"
        }
      }
    };

    const wrapper = shallow(<MainCreation {...sProps} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");
    const tablist = header.find("TabList");
    expect(
      tablist
        .children()
        .at(1)
        .prop("disabled")
    ).toBe(false);
  });

  it("Third Tab should be disabled if options.name not set", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");
    const tablist = header.find("TabList");
    expect(
      tablist
        .children()
        .at(2)
        .prop("disabled")
    ).toBe(true);
  });

  it("Third Tab should not be disabled if options.name is set", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        options: {
          ...props.account.options,
          name: "test"
        }
      }
    };

    const wrapper = shallow(<MainCreation {...sProps} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");
    const tablist = header.find("TabList");
    expect(
      tablist
        .children()
        .at(2)
        .prop("disabled")
    ).toBe(false);
  });

  it("Fourth Tab should be disabled if account security no set", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");
    const tablist = header.find("TabList");
    expect(
      tablist
        .children()
        .at(3)
        .prop("disabled")
    ).toBe(true);
  });

  it("Fourth Tab should be disabled if approvals > members length", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        security: {
          ...props.account.security,
          members: [{}],
          approvals: 2
        }
      }
    };

    const wrapper = shallow(<MainCreation {...sProps} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");
    const tablist = header.find("TabList");
    expect(
      tablist
        .children()
        .at(3)
        .prop("disabled")
    ).toBe(true);
  });

  it("Fourth Tab should be disabled if approvals === 0", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        security: {
          ...props.account.security,
          members: [{}],
          approvals: 0
        }
      }
    };

    const wrapper = shallow(<MainCreation {...sProps} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");
    const tablist = header.find("TabList");
    expect(
      tablist
        .children()
        .at(3)
        .prop("disabled")
    ).toBe(true);
  });

  it("Fourth Tab should not be disabled if account security is set", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        security: {
          ...props.account.security,
          members: [{}],
          approvals: 1
        }
      }
    };

    const wrapper = shallow(<MainCreation {...sProps} />);
    const tabs = wrapper.children().at(0);
    const header = tabs.find("header");
    const tablist = header.find("TabList");
    expect(
      tablist
        .children()
        .at(3)
        .prop("disabled")
    ).toBe(false);
  });

  it("first TabPanel should have a wrapper Overscroll", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    expect(
      wrapper
        .find("TabPanel")
        .children()
        .at(0)
        .type()
    ).toBe(Overscroll);
  });

  it("first TabPanel should Contain AccountCreationCurrencies", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    expect(
      wrapper
        .find("TabPanel")
        .children()
        .at(0)
        .children()
        .type()
    ).toBe(AccountCreationCurrencies);
  });

  it("AccountCrationCurrencies should have the right props", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const currencies = wrapper
      .find("TabPanel")
      .at(0)
      .children()
      .at(0)
      .children();

    expect(currencies.prop("currency")).toBe(props.account.currency);
    expect(currencies.prop("currencies")).toBe(props.currencies.currencies);
    expect(currencies.prop("onSelect")).toBe(props.selectCurrency);
  });

  it("second TabPanel should Contain AccountCreationOptions", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    expect(
      wrapper
        .find("TabPanel")
        .children()
        .at(1)
        .type()
    ).toBe(AccountCreationOptions);
  });

  it("AccountCreationOptions should have the right props", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const options = wrapper
      .find("TabPanel")
      .at(1)
      .children()
      .at(0);

    expect(options.prop("currency")).toBe(props.account.currency);
    expect(options.prop("options")).toBe(props.account.options);
    expect(options.prop("changeName")).toBe(props.changeAccountName);
  });

  it("third TabPanel should Contain AccountCreationSecurity", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    expect(
      wrapper
        .find("TabPanel")
        .children()
        .at(2)
        .type()
    ).toBe(AccountCreationSecurity);
  });

  it("AccountCreationSecurity should have the right props", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const securities = wrapper
      .find("TabPanel")
      .at(2)
      .children()
      .at(0);

    expect(securities.prop("switchInternalModal")).toBe(
      props.switchInternalModal
    );
    expect(securities.prop("account")).toBe(props.account);
  });

  it("fourth TabPanel should Contain AccountCreationConfirmation", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    expect(
      wrapper
        .find("TabPanel")
        .children()
        .at(3)
        .type()
    ).toBe(AccountCreationConfirmation);
  });

  it("AccountCreationConfirmation should have the right props", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const confirmation = wrapper
      .find("TabPanel")
      .at(3)
      .children()
      .at(0);

    expect(confirmation.prop("account")).toBe(props.account);
  });

  it("should display a cancel button with close() method attached", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const dialog = wrapper.find("DialogButton").at(0);

    expect(dialog.prop("children")).toBe("Cancel");
    dialog.simulate("touchTap");
    expect(props.close).toHaveBeenCalled();
  });

  it("footer should contain continue if tab 0", () => {
    const wrapper = shallow(<MainCreation {...props} />);
    const dialog = wrapper.find("DialogButton").at(1);

    expect(dialog.prop("children")).toBe("Continue");
    dialog.simulate("touchTap");
    expect(props.onSelect).toHaveBeenCalled();
  });

  it("footer should contain continue if tab 1", () => {
    const sProps = { ...props, tabsIndex: 1 };
    const wrapper = shallow(<MainCreation {...sProps} />);
    const dialog = wrapper.find("DialogButton").at(1);

    expect(dialog.prop("children")).toBe("Continue");
    dialog.simulate("touchTap");
    expect(props.onSelect).toHaveBeenCalled();
  });

  it("footer should contain continue if tab 2", () => {
    const sProps = { ...props, tabsIndex: 2 };
    const wrapper = shallow(<MainCreation {...sProps} />);
    const dialog = wrapper.find("DialogButton").at(1);

    expect(dialog.prop("children")).toBe("Continue");
    dialog.simulate("touchTap");
    expect(props.onSelect).toHaveBeenCalled();
  });

  it("footer should contain done if tab 2", () => {
    const sProps = { ...props, tabsIndex: 3 };
    const wrapper = shallow(<MainCreation {...sProps} />);
    const dialog = wrapper.find("DialogButton").at(1);

    expect(dialog.prop("children")).toBe("Done");
    dialog.simulate("touchTap");
    expect(props.save).toHaveBeenCalled();
  });
});
