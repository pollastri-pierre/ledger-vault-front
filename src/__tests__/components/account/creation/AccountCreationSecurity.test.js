import React from "react";
import { shallow } from "enzyme";
import AccountCreationSecurity from "../../../../components/accounts/creation/AccountCreationSecurity";

describe("AccountCreationSecurity test", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const props = {
    account: {
      security: {
        approvals: "a",
        members: [
          {
            id: 1,
            name: "name",
            firstname: "firstname"
          }
        ],
        ratelimiter: {
          enabled: true,
          frequency: "day",
          rate: 3
        },
        timelock: {
          enabled: true,
          frequency: "hour",
          duration: 3
        }
      },
      options: {
        name: "name"
      },
      currency: {
        name: "Bitcoin",
        shortname: "btc"
      }
    },
    switchInternalModal: jest.fn()
  };

  it("should be a .account-creation-security div", () => {
    const wrapper = shallow(<AccountCreationSecurity {...props} />);
    expect(wrapper.find("div.account-creation-security").length).toBe(1);
  });

  it("should have a h4 with Security Scheme", () => {
    const wrapper = shallow(<AccountCreationSecurity {...props} />);
    expect(wrapper.find("h4").text()).toBe("Security Scheme");
  });

  it("first h5 should be members", () => {
    const wrapper = shallow(<AccountCreationSecurity {...props} />);
    expect(
      wrapper
        .find("h5")
        .at(0)
        .text()
    ).toBe("Members");
  });

  it("first .security-scheme-line should call switchInternalModal(members)", () => {
    const wrapper = shallow(<AccountCreationSecurity {...props} />);
    const line = wrapper.find(".security-members .security-scheme-line").at(0);

    line.simulate("click");
    expect(props.switchInternalModal).toHaveBeenCalledWith("members");
  });

  it("second .security-scheme-line should call switchInternalModal(approvals)", () => {
    const wrapper = shallow(<AccountCreationSecurity {...props} />);
    const line = wrapper.find(".security-members .security-scheme-line").at(1);

    line.simulate("click");
    expect(props.switchInternalModal).toHaveBeenCalledWith("approvals");
  });

  it("timelock security-scheme-line onClick should call switchInternalModal(time-lock)", () => {
    const wrapper = shallow(<AccountCreationSecurity {...props} />);
    const line = wrapper
      .find(".security-timelock-ratelimiter .security-scheme-line")
      .at(0);

    line.simulate("click");
    expect(props.switchInternalModal).toHaveBeenCalledWith("time-lock");
  });

  it("ratelimiter security-scheme-line onClick should call switchInternalModal(rate-limiter)", () => {
    const wrapper = shallow(<AccountCreationSecurity {...props} />);
    const line = wrapper
      .find(".security-timelock-ratelimiter .security-scheme-line")
      .at(1);

    line.simulate("click");
    expect(props.switchInternalModal).toHaveBeenCalledWith("rate-limiter");
  });

  it("should contain the members length", () => {
    const wrapper = shallow(<AccountCreationSecurity {...props} />);
    const members = wrapper
      .find(".security-members .security-scheme-line")
      .at(0)
      .find(".security-scheme-value");

    expect(members.text()).toBe("1 selected<ArrowDown />");
  });

  it("approvals should be disabled if members length === 0", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        security: {
          ...props.account.security,
          members: []
        }
      }
    };
    const wrapper = shallow(<AccountCreationSecurity {...sProps} />);
    const approvals = wrapper
      .find(".security-members .security-scheme-line")
      .at(1);

    expect(approvals.prop("className")).toContain("disabled");
  });

  it("approvals should have an error className  if approvals > members.length", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        security: {
          ...props.account.security,
          approvals: 2
        }
      }
    };
    const wrapper = shallow(<AccountCreationSecurity {...sProps} />);
    const approvals = wrapper
      .find(".security-members .security-scheme-line")
      .at(1);

    expect(approvals.prop("className")).toContain("error");
  });
});
