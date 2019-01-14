jest.mock("network");
import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { AccountCreation } from "./AccountCreation";
import { initialState } from "redux/modules/account-creation";
import NewAccountMutation from "api/mutations/NewAccountMutation";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";

Enzyme.configure({ adapter: new Adapter() });

const props = {
  onAddMember: jest.fn(),
  onSetApprovals: jest.fn(),
  onSetTimelock: jest.fn(),
  onSetRatelimiter: jest.fn(),
  onChangeTabAccount: jest.fn(),
  onChangeAccountName: jest.fn(),
  onSwitchInternalModal: jest.fn(),
  onClearState: jest.fn(),
  history: {
    goBack: jest.fn()
  },
  accounts: [],
  accountCreationState: initialState,
  restlay: {
    commitMutation: jest.fn(() => Promise.resolve("test")),
    fetchQuery: jest.fn()
  }
};

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

test("todo test for createAccount process network", async () => {
  const sProps = {
    ...props,
    accountCreationState: {
      ...props.accountCreationState,
      name: "test",
      quorum: 1,
      currency: { id: 1 },
      approvers: ["pubKey"]
    }
  };
  const MyComponent = shallow(<AccountCreation {...sProps} />);
  MyComponent.instance().close = jest.fn();
  await MyComponent.instance().createAccount(1);
  const data = {
    account_id: 1,
    name: "test",
    currency: {
      name: 1
    },
    security_scheme: {
      quorum: 1
    },
    members: [{ pub_key: "pubKey" }]
  };
  expect(sProps.restlay.commitMutation).toHaveBeenCalledWith(
    new NewAccountMutation(data)
  );
  expect(MyComponent.instance().close).toHaveBeenCalled();
  expect(sProps.restlay.fetchQuery).toHaveBeenCalledWith(
    new PendingAccountsQuery()
  );
});
