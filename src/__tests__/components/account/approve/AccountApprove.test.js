import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { Tabs } from "react-tabs";
import { shallow, mount } from "enzyme";
import { AccountApprove } from "../../../../components";
import AbortConfirmation from "../../../../components/accounts/approve/AbortConfirmation";
import ApproveDevice from "../../../../components/accounts/approve/ApproveDevice";

injectTapEventPlugin();
const props = {
  account: {
    isLoading: false,
    isAborting: false,
    isDevice: false,
    account: null
  },
  organization: {},
  close: jest.fn(),
  abort: jest.fn(),
  aborting: jest.fn(),
  approving: jest.fn(),
  getAccount: jest.fn(),
  getOrganizationMembers: jest.fn(),
  getOrganizationApprovers: jest.fn()
};

const mainProps = {
  ...props,
  account: {
    ...props.account,
    account: {}
  }
};

describe("AccountApprove component", () => {
  it("should call getAccount", () => {
    const muiTheme = getMuiTheme({
      fontFamily: "Open Sans, sans-serif"
    });
    mount(
      <MuiThemeProvider muiTheme={muiTheme}>
        <AccountApprove {...props} />
      </MuiThemeProvider>
    );
    expect(props.getAccount).toHaveBeenCalled();
  });

  // testing loading state

  it("should have a .header", () => {
    const wrapper = shallow(<AccountApprove {...props} />);
    expect(wrapper.find("#account-creation .header").length).toBe(1);
  });

  it("should have CircularProgress inside #account-creation.wrapper.loading .content", () => {
    const wrapper = shallow(<AccountApprove {...props} />);
    expect(
      wrapper
        .find("#account-creation.wrapper.loading .content")
        .find("CircularProgress").length
    ).toBe(1);
  });

  it("should have a .footer", () => {
    const wrapper = shallow(<AccountApprove {...props} />);
    expect(wrapper.find("#account-creation .footer").length).toBe(1);
  });

  it("footer should have a DialogButton with onTouchTap bind to close()", () => {
    const wrapper = shallow(<AccountApprove {...props} />);
    const DialogButton = wrapper.find(".footer").find("DialogButton");
    DialogButton.simulate("touchTap");
    expect(props.close).toHaveBeenCalled();
  });

  /* end of state loading test */

  it("should display AbortConfirmation if account.isAborting", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        isAborting: true,
        isLoading: false,
        account: {}
      }
    };

    const wrapper = shallow(<AccountApprove {...sProps} />);
    expect(wrapper.type()).toBe(AbortConfirmation);
    expect(wrapper.prop("aborting")).toEqual(sProps.aborting);
    expect(wrapper.prop("abort")).toEqual(sProps.abort);
  });

  it("should display ApproveDevice if account.isDevice", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        isDevice: true,
        isLoading: false,
        account: {}
      }
    };

    const wrapper = shallow(<AccountApprove {...sProps} />);
    expect(wrapper.type()).toBe(ApproveDevice);
    expect(wrapper.prop("cancel")).toEqual(sProps.approving);
  });

  /* main view testing */
  it("should be a Tabs#account-creation.wapper.loading", () => {
    const wrapper = shallow(<AccountApprove {...mainProps} />);
    expect(wrapper.type()).toBe(Tabs);
    expect(wrapper.prop("id")).toBe("account-creation");
    expect(wrapper.prop("className")).toBe("wrapper loading");
  });

  it("should contain 3 Tab with details with details, members, approvals", () => {
    const wrapper = shallow(<AccountApprove {...mainProps} />);
    expect(
      wrapper
        .find("TabList Tab")
        .at(0)
        .children()
        .text()
    ).toBe("details");
    expect(
      wrapper
        .find("TabList Tab")
        .at(1)
        .children()
        .text()
    ).toBe("members");
    expect(
      wrapper
        .find("TabList Tab")
        .at(2)
        .children()
        .text()
    ).toBe("approvals");
  });

  it("First TabPanel should contain an AccountApproveDetails", () => {
    const wrapper = shallow(<AccountApprove {...mainProps} />);
    const AccountApproveDetails = wrapper
      .find(".content TabPanel")
      .at(0)
      .find("AccountApproveDetails");

    expect(AccountApproveDetails.prop("account")).toEqual(
      mainProps.account.account
    );
    expect(AccountApproveDetails.prop("organization")).toEqual(
      mainProps.organization
    );
  });

  it("Second TabPanel should contain an AccountApproveMembers", () => {
    const wrapper = shallow(<AccountApprove {...mainProps} />);
    const AccountApproveMembers = wrapper
      .find(".content TabPanel")
      .at(1)
      .find("AccountApproveMembers");

    expect(AccountApproveMembers.prop("organization")).toEqual(
      mainProps.organization
    );
    expect(AccountApproveMembers.prop("getOrganizationMembers")).toEqual(
      mainProps.getOrganizationMembers
    );
    expect(AccountApproveMembers.prop("account")).toEqual(
      mainProps.account.account
    );
  });

  it("Third TabPanel should contain an AccountApproveApprovals", () => {
    const wrapper = shallow(<AccountApprove {...mainProps} />);
    const AccountApproveApprovals = wrapper
      .find(".content TabPanel")
      .at(2)
      .find("AccountApproveApprovals");

    expect(AccountApproveApprovals.prop("organization")).toEqual(
      mainProps.organization
    );
    expect(AccountApproveApprovals.prop("getOrganizationMembers")).toEqual(
      mainProps.getOrganizationMembers
    );
    expect(AccountApproveApprovals.prop("getOrganizationApprovers")).toEqual(
      mainProps.getOrganizationApprovers
    );
    expect(AccountApproveApprovals.prop("account")).toEqual(
      mainProps.account.account
    );
  });

  it("should contain a Footer", () => {
    const wrapper = shallow(<AccountApprove {...mainProps} />);
    const Footer = wrapper.find("Footer");

    expect(Footer.prop("close")).toEqual(mainProps.close);
    expect(Footer.prop("approve")).toEqual(mainProps.approving);
    expect(Footer.prop("aborting")).toEqual(mainProps.aborting);
    expect(Footer.prop("approved")).toEqual(mainProps.account.isApproved);
  });
});
