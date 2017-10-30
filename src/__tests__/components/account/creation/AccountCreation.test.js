import React from "react";
import { shallow } from "enzyme";
import { AccountCreation } from "../../../../components";

describe("AccountCreation test", () => {
  const props = {
    organization: {},
    currencies: {},
    close: jest.fn(),
    changeAccountName: jest.fn(),
    account: {
      internModalId: "main",
      security: {
        timelock: {},
        ratelimiter: {},
        approvals: "",
        members: []
      },
      popBubble: false,
      popAnchor: {}
    },
    selectCurrency: jest.fn(),
    onSelect: jest.fn(),
    tabsIndex: 0,
    switchInternalModal: jest.fn(),
    getOrganizationMembers: jest.fn(),
    addMember: jest.fn(),
    setApprovals: jest.fn(),
    enableTimeLock: jest.fn(),
    enableRatelimiter: jest.fn(),
    openPopBubble: jest.fn(),
    changeTimeLock: jest.fn(),
    changeRatelimiter: jest.fn(),
    changeFrequency: jest.fn(),
    save: jest.fn()
  };

  it("should render MainCreation component with right props", () => {
    const wrapper = shallow(<AccountCreation {...props} />);
    const Main = wrapper.find("MainCreation");

    expect(Main.length).toBe(1);

    expect(Main.prop("currencies")).toEqual(props.currencies);
    expect(Main.prop("close")).toEqual(props.close);
    expect(Main.prop("account")).toEqual(props.account);
    expect(Main.prop("changeAccountName")).toEqual(props.changeAccountName);
    expect(Main.prop("selectCurrency")).toEqual(props.selectCurrency);
    expect(Main.prop("tabsIndex")).toEqual(props.tabsIndex);
    expect(Main.prop("onSelect")).toEqual(props.onSelect);
    expect(Main.prop("save")).toEqual(props.save);
    expect(Main.prop("switchInternalModal")).toEqual(props.switchInternalModal);
  });

  it("should render RateLimiter component with right props", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        internModalId: "rate-limiter"
      }
    };
    const wrapper = shallow(<AccountCreation {...sProps} />);
    const Ratelimiter = wrapper.find("AccountCreationRateLimiter");

    expect(Ratelimiter.length).toBe(1);

    expect(Ratelimiter.prop("ratelimiter")).toEqual(
      props.account.security.ratelimiter
    );
    expect(Ratelimiter.prop("enable")).toEqual(props.enableRatelimiter);
    expect(Ratelimiter.prop("change")).toEqual(props.changeRatelimiter);
    expect(Ratelimiter.prop("popbubble")).toEqual(props.account.popBubble);
    expect(Ratelimiter.prop("openPopBubble")).toEqual(props.openPopBubble);
    expect(Ratelimiter.prop("anchor")).toEqual(props.account.popAnchor);
    expect(Ratelimiter.prop("changeFrequency")).toEqual(props.changeFrequency);
    expect(Ratelimiter.prop("switchInternalModal")).toEqual(
      props.switchInternalModal
    );
  });

  it("should render Members component with right props", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        internModalId: "members"
      }
    };
    const wrapper = shallow(<AccountCreation {...sProps} />);
    const Members = wrapper.find("AccountCreationMembers");

    expect(Members.length).toBe(1);

    expect(Members.prop("members")).toEqual(props.account.security.members);
    expect(Members.prop("organization")).toEqual(props.organization);
    expect(Members.prop("getOrganizationMembers")).toEqual(
      props.getOrganizationMembers
    );
    expect(Members.prop("addMember")).toEqual(props.addMember);
    expect(Members.prop("switchInternalModal")).toEqual(
      props.switchInternalModal
    );
  });

  it("should render TimeLock component with right props", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        internModalId: "time-lock"
      }
    };
    const wrapper = shallow(<AccountCreation {...sProps} />);
    const TimeLock = wrapper.find("AccountCreationTimeLock");

    expect(TimeLock.length).toBe(1);

    expect(TimeLock.prop("timelock")).toEqual(props.account.security.timelock);
    expect(TimeLock.prop("enable")).toEqual(props.enableTimeLock);
    expect(TimeLock.prop("change")).toEqual(props.changeTimeLock);
    expect(TimeLock.prop("popbubble")).toEqual(props.account.popBubble);
    expect(TimeLock.prop("openPopBubble")).toEqual(props.openPopBubble);
    expect(TimeLock.prop("anchor")).toEqual(props.account.popAnchor);
    expect(TimeLock.prop("changeFrequency")).toEqual(props.changeFrequency);
    expect(TimeLock.prop("switchInternalModal")).toEqual(
      props.switchInternalModal
    );
  });

  it("should render Approvals component with right props", () => {
    const sProps = {
      ...props,
      account: {
        ...props.account,
        internModalId: "approvals"
      }
    };
    const wrapper = shallow(<AccountCreation {...sProps} />);
    const Approvals = wrapper.find("AccountCreationApprovals");

    expect(Approvals.length).toBe(1);

    expect(Approvals.prop("setApprovals")).toEqual(props.setApprovals);
    expect(Approvals.prop("members")).toEqual(props.account.security.members);
    expect(Approvals.prop("approvals")).toEqual(
      props.account.security.approvals
    );
    expect(Approvals.prop("switchInternalModal")).toEqual(
      props.switchInternalModal
    );
  });
});
