jest.mock("device/VaultDeviceApp");
jest.mock("@ledgerhq/hw-transport-u2f", () => ({
  create: jest.fn()
}));
import React from "react";
import { U2F_PATH, APPID_VAULT_BOOTSTRAP } from "device";
import { Authentication } from "./Authentication";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SpinnerCard from "components/spinners/SpinnerCard";
import { Title, Introduction } from "components/Onboarding";
import Footer from "./Footer";

import VaultDeviceApp, {
  mockGetPublicKey,
  mockAuthenticate
} from "device/VaultDeviceApp";

Enzyme.configure({ adapter: new Adapter() });
jest.mock("network", () => jest.fn());

beforeEach(() => {
  VaultDeviceApp.mockClear();
  mockGetPublicKey.mockClear();
  mockAuthenticate.mockClear();
});

const onboarding = {
  bootstrapChallenge: null
};

test("should call getBootstrapChallenge", () => {
  const props = {
    onboarding: onboarding,
    onAddMessage: jest.fn(),
    onGetBootstrapChallenge: jest.fn(),
    onGetBootstrapToken: jest.fn()
  };
  shallow(<Authentication {...props} />);
  expect(props.onGetBootstrapChallenge).toHaveBeenCalled();
});

test("should render a spinner", () => {
  const props = {
    onboarding: onboarding,
    onAddMessage: jest.fn(),
    onGetBootstrapChallenge: jest.fn()
  };
  const MyComponent = shallow(<Authentication {...props} />);
  expect(MyComponent.find(SpinnerCard).length).toBe(1);
});

test("should not call getBootstrapChallenge", () => {
  const props = {
    onboarding: { ...onboarding, bootstrapChallenge: "test" },
    onAddMessage: jest.fn(),
    onGetBootstrapChallenge: jest.fn()
  };
  shallow(<Authentication {...props} />);
  expect(props.onGetBootstrapChallenge).not.toHaveBeenCalled();
});

test("should render a Title, an Intro, an Authenticator and a Footer", () => {
  const props = {
    onboarding: { ...onboarding, bootstrapChallenge: "g" },
    onAddMessage: jest.fn(),
    onGetBootstrapChallenge: jest.fn()
  };
  const MyComponent = shallow(<Authentication {...props} />);
  expect(
    MyComponent.find(Title)
      .children()
      .text()
  ).toBe("Authentication");
  expect(MyComponent.find(Introduction).length).toBe(1);
  expect(MyComponent.find(Footer).length).toBe(1);
  expect(MyComponent.find(Footer).prop("render")().props.disabled).toBe(true);
});

test("should not call onStart when receive props with undefined challenge", () => {
  const props = {
    onboarding: onboarding,
    onAddMessage: jest.fn(),
    onGetBootstrapChallenge: jest.fn(),
    onGetBootstrapToken: jest.fn()
  };

  const nextProps = {
    onboarding: { ...onboarding, bootstrapChallenge: null },
    onAddMessage: jest.fn(),
    onGetBootstrapChallenge: jest.fn()
  };

  const MyComponent = shallow(<Authentication {...props} />);
  MyComponent.instance().onStart = jest.fn();
  MyComponent.setProps(nextProps);
  expect(MyComponent.instance().onStart).not.toHaveBeenCalled();
});

test("should start onStart when receive props with the challenge", () => {
  const props = {
    onboarding: onboarding,
    onAddMessage: jest.fn(),
    onGetBootstrapChallenge: jest.fn(),
    onGetBootstrapToken: jest.fn()
  };

  const nextProps = {
    onboarding: { ...onboarding, bootstrapChallenge: "gotIt" },
    onAddMessage: jest.fn(),
    onGetBootstrapChallenge: jest.fn(),
    onGetBootstrapToken: jest.fn()
  };

  const MyComponent = shallow(<Authentication {...props} />);
  MyComponent.instance().onStart = jest.fn();
  MyComponent.setProps(nextProps);
  expect(MyComponent.instance().onStart).toHaveBeenCalled();
});

test("onStart method", async () => {
  const props = {
    onboarding: {
      ...onboarding,
      bootstrapChallenge: {
        challenge: "challenge",
        key_handle: { key_handle: "handle1" }
      }
    },
    onAddMessage: jest.fn(),
    onGetBootstrapChallenge: jest.fn(),
    onGetBootstrapToken: jest.fn()
  };
  const MyComponent = shallow(<Authentication {...props} />);
  await MyComponent.instance().onStart();
  expect(VaultDeviceApp).toHaveBeenCalledTimes(1);
  expect(mockGetPublicKey).toHaveBeenCalledWith(U2F_PATH, false);
  expect(mockAuthenticate).toHaveBeenCalledWith(
    Buffer.from("challenge", "base64"),
    APPID_VAULT_BOOTSTRAP,
    Buffer.from("handle1", "base64")
  );
  expect(props.onGetBootstrapToken).toHaveBeenCalledWith("pubKey", {
    userPresence: "userPresence",
    counter: 0,
    signature: "signature",
    rawResponse: "raw"
  });
});

test("Footer should be continuable if bootstrapAuthToken exists", () => {
  const props = {
    onboarding: {
      ...onboarding,
      bootstrapChallenge: "test",
      bootstrapAuthToken: "g"
    },
    onAddMessage: jest.fn(),
    onGetBootstrapChallenge: jest.fn()
  };
  const MyComponent = shallow(<Authentication {...props} />);
  expect(MyComponent.find(Footer).prop("render")().props.disabled).toBe(false);
});
