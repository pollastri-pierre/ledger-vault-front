import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { AccountCreation } from "./AccountCreation";
import { initialState } from "redux/modules/account-creation";
import MainCreation from "./MainCreation";
import AccountCreationMembers from "./AccountCreationMembers";
import AccountCreationApprovals from "./AccountCreationApprovals";
import DeviceAuthenticate from "components/DeviceAuthenticate";
import AccountCreationTimeLock from "./AccountCreationTimeLock";
import AccountCreationRateLimiter from "./AccountCreationRateLimiter";

Enzyme.configure({ adapter: new Adapter() });

const props = {
  onAddMember: jest.fn(),
  onSetApprovals: jest.fn(),
  onSetTimelock: jest.fn(),
  onSetRatelimiter: jest.fn(),
  onChangeTabAccount: jest.fn(),
  onSelectCurrency: jest.fn(),
  onChangeAccountName: jest.fn(),
  onSwitchInternalModal: jest.fn(),
  onClearState: jest.fn(),
  history: {
    goBack: jest.fn()
  },
  accountCreation: initialState
};
test("it sould render AccountCreationMembers", () => {
  const sProps = {
    ...props,
    accountCreation: { ...props.accountCreation, internModalId: "members" }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  expect(MyComponent.find(AccountCreationMembers).length).toBe(1);
});

test("it sould render AccountCreationMembers with right props", () => {
  const sProps = {
    ...props,
    accountCreation: { ...props.accountCreation, internModalId: "members" }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  const Members = MyComponent.find(AccountCreationMembers);
  expect(Members.props()).toEqual({
    approvers: props.accountCreation.approvers,
    switchInternalModal: props.onSwitchInternalModal,
    addMember: props.onAddMember
  });
});

test("it sould render AccountCreationApprovals", () => {
  const sProps = {
    ...props,
    accountCreation: { ...props.accountCreation, internModalId: "approvals" }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  expect(MyComponent.find(AccountCreationApprovals).length).toBe(1);
});

test("it sould render AccountCreationApprovals with right props", () => {
  const sProps = {
    ...props,
    accountCreation: { ...props.accountCreation, internModalId: "approvals" }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  const Approvals = MyComponent.find(AccountCreationApprovals);
  expect(Approvals.props()).toEqual({
    setApprovals: props.onSetApprovals,
    members: props.accountCreation.approvers,
    switchInternalModal: props.onSwitchInternalModal,
    approvals: props.accountCreation.quorum
  });
});

test("it sould render AccountCreationTimeLock", () => {
  const sProps = {
    ...props,
    accountCreation: { ...props.accountCreation, internModalId: "time-lock" }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  expect(MyComponent.find(AccountCreationTimeLock).length).toBe(1);
});

test("it sould render AccountCreationTimeLock with right props", () => {
  const sProps = {
    ...props,
    accountCreation: { ...props.accountCreation, internModalId: "time-lock" }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  const Timelock = MyComponent.find(AccountCreationTimeLock);
  expect(Timelock.props()).toEqual({
    setTimelock: props.onSetTimelock,
    timelock: props.accountCreation.time_lock,
    switchInternalModal: props.onSwitchInternalModal
  });
});

test("it sould render AccountCreationRateLimiter", () => {
  const sProps = {
    ...props,
    accountCreation: { ...props.accountCreation, internModalId: "rate-limiter" }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  expect(MyComponent.find(AccountCreationRateLimiter).length).toBe(1);
});

test("it sould render AccountCreationRateLimiter with right props", () => {
  const sProps = {
    ...props,
    accountCreation: { ...props.accountCreation, internModalId: "rate-limiter" }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  const Rate = MyComponent.find(AccountCreationRateLimiter);
  expect(Rate.props()).toEqual({
    setRatelimiter: props.onSetRatelimiter,
    rate_limiter: props.accountCreation.rate_limiter,
    switchInternalModal: props.onSwitchInternalModal
  });
});

test("it sould render MainCreation", () => {
  const sProps = {
    ...props,
    accountCreation: { ...props.accountCreation, internModalId: "main" }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  expect(MyComponent.find(MainCreation).length).toBe(1);
});

test("it sould render AccountCreationRateLimiter with right props", () => {
  const sProps = {
    ...props,
    accountCreation: { ...props.accountCreation, internModalId: "main" }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  const Main = MyComponent.find(MainCreation);
  expect(Main.props()).toEqual({
    account: props.accountCreation,
    changeAccountName: props.onChangeAccountName,
    selectCurrency: props.onSelectCurrency,
    tabsIndex: props.accountCreation.currentTab,
    onSelect: props.onChangeTabAccount,
    close: MyComponent.instance().close,
    switchInternalModal: props.onSwitchInternalModal
  });
});

test("it sould render DeviceAuthenticate", () => {
  const sProps = {
    ...props,
    accountCreation: { ...props.accountCreation, internModalId: "device" }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  expect(MyComponent.find(DeviceAuthenticate).length).toBe(1);
});

test("it sould render DeviceAuthenticate with right props", () => {
  const sProps = {
    ...props,
    accountCreation: { ...props.accountCreation, internModalId: "device" }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  const Device = MyComponent.find(DeviceAuthenticate);
  expect(Device.prop("type")).toBe("accounts");
  expect(Device.prop("close")).toBe(MyComponent.instance().close);
  expect(Device.prop("callback")).toBe(MyComponent.instance().createAccount);
});

test("it should call onClearState on mount", () => {
  const MyComponent = shallow(<AccountCreation {...props} />);
  MyComponent.instance().componentDidMount();
  expect(props.onClearState).toHaveBeenCalled();
});

test("close method should call history goBack()", () => {
  const MyComponent = shallow(<AccountCreation {...props} />);
  MyComponent.instance().close();
  expect(props.history.goBack).toHaveBeenCalled();
});

test("todo test for createAccount process network", () => {
  expect(false).toBe(true);
});
