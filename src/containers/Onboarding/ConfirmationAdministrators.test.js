import { APPID_VAULT_BOOTSTRAP } from "device";
jest.mock("device/VaultDeviceApp");
jest.mock("@ledgerhq/hw-transport-u2f", () => ({
  create: jest.fn()
}));

jest.mock("network", () => jest.fn());

beforeEach(() => {
  VaultDeviceApp.mockClear();
  mockGetPublicKey.mockClear();
  mockAuthenticate.mockClear();
});
import React from "react";
import { ConfirmationAdministrators } from "./ConfirmationAdministrators";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SpinnerCard from "components/spinners/SpinnerCard";
import Authenticator from "./Authenticator";

import VaultDeviceApp, {
  mockGetPublicKey,
  mockAuthenticate
} from "device/VaultDeviceApp";

Enzyme.configure({ adapter: new Adapter() });

const props = {
  onGetCommitChallenge: jest.fn(),
  onCommitAdministrators: jest.fn(),
  onAddMessage: jest.fn(),
  onboarding: {
    commit_challenge: null,
    members: []
  },
  classes: {}
};

test("should render a spinner if commit_challenge is not present in props", () => {
  const MyComponent = shallow(<ConfirmationAdministrators {...props} />);
  expect(MyComponent.find(SpinnerCard).length).toBe(1);
});

test("should call onGetCommitChallenge if not present in props", async () => {
  shallow(<ConfirmationAdministrators {...props} />);
  expect(props.onGetCommitChallenge).toHaveBeenCalled();
});

test("should render an authenticator if commit_challenge is prensent", () => {
  const sProps = {
    ...props,
    onboarding: { ...props.onboarding, commit_challenge: {} }
  };
  const MyComponent = shallow(<ConfirmationAdministrators {...sProps} />);
  expect(MyComponent.find(SpinnerCard).length).toBe(0);
  expect(MyComponent.find(Authenticator).length).toBe(1);
});

test("should call the device and API with the right parameters", async () => {
  const sProps = {
    ...props,
    onboarding: {
      ...props.onboarding,
      commit_challenge: {
        challenge: "challenge",
        key_handle: { key_handle: "handle1" }
      }
    }
  };
  const MyComponent = shallow(<ConfirmationAdministrators {...sProps} />);
  await MyComponent.instance().onStart();
  expect(mockAuthenticate).toHaveBeenCalledWith(
    Buffer.from("challenge", "base64"),
    APPID_VAULT_BOOTSTRAP,
    Buffer.from("handle1", "base64"),
    "",
    "",
    "",
    ""
  );

  expect(sProps.onCommitAdministrators).toHaveBeenCalledWith("pubKey", {
    counter: 0,
    rawResponse: "raw",
    signature: "signature",
    userPresence: "userPresence"
  });
});

test("should call onStart when receive props with challenge", () => {
  const nextProps = {
    ...props,
    onboarding: {
      ...props.onboarding,
      commit_challenge: { challenge: "challenge", handles: ["handle1"] }
    }
  };
  const MyComponent = shallow(<ConfirmationAdministrators {...props} />);
  MyComponent.instance().onStart = jest.fn();
  MyComponent.setProps(nextProps);
  expect(MyComponent.instance().onStart).toHaveBeenCalled();
});
