jest.mock("device/VaultDeviceApp");
jest.mock("@ledgerhq/hw-transport-u2f", () => ({
  create: jest.fn()
}));

jest.mock("network", () => jest.fn());
import network from "network";
import React from "react";
import { U2F_PATH, APPID_VAULT_ADMINISTRATOR } from "device";
// import StepDeviceGeneric from "containers/Onboarding/StepDeviceGeneric";
import { DeviceAuthenticate } from "./";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

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

const props = {
  close: jest.fn(),
  callback: jest.fn(),
  cancel: jest.fn(),
  type: "accounts",
  organization: {
    name: "name",
    workspace: "workspace",
    domain_name: "domain",
    role: "Administrator"
  }
};

test("authenticate for account creation should call API and device", async () => {
  network.mockImplementation(() => ({
    challenge: "challenge",
    key_handle: {
      PUBKEY: "key_handle"
    },
    account_id: 1
  }));
  const MyComponent = shallow(<DeviceAuthenticate {...props} />);
  await MyComponent.instance().start();

  expect(mockGetPublicKey).toHaveBeenCalledWith(U2F_PATH, false);

  expect(network).toHaveBeenCalledWith(
    "/accounts/authentications/PUBKEY/challenge",
    "GET"
  );

  expect(mockAuthenticate).toHaveBeenCalledWith(
    Buffer.from("challenge", "base64"),
    APPID_VAULT_ADMINISTRATOR,
    Buffer.from("key_handle", "base64"),
    "name",
    "workspace",
    "domain",
    "Administrator"
  );

  expect(network).toHaveBeenCalledWith(
    "/accounts/authentications/authenticate",
    "POST",
    {
      pub_key: "PUBKEY",
      authentication: "raw",
      account_id: 1
    }
  );
  expect(props.callback).toHaveBeenCalled();
});

test("authenticate for operation creation should call API and device", async () => {
  network.mockImplementation(() => ({
    challenge: "challenge",
    key_handle: {
      PUBKEY: "key_handle"
    },
    operation_id: 1
  }));
  const sProps = { ...props, type: "operations", account_id: 1 };
  const MyComponent = shallow(<DeviceAuthenticate {...sProps} />);
  await MyComponent.instance().start();

  expect(mockGetPublicKey).toHaveBeenCalledWith(U2F_PATH, false);

  expect(network).toHaveBeenCalledWith(
    "/accounts/1/operations/authentications/PUBKEY/challenge",
    "GET"
  );

  expect(mockAuthenticate).toHaveBeenCalledWith(
    Buffer.from("challenge", "base64"),
    APPID_VAULT_ADMINISTRATOR,
    Buffer.from("key_handle", "base64"),
    "name",
    "workspace",
    "domain",
    "Administrator"
  );

  expect(network).toHaveBeenCalledWith(
    "/operations/authentications/authenticate",
    "POST",
    {
      pub_key: "PUBKEY",
      authentication: "raw",
      operation_id: 1
    }
  );
  expect(props.callback).toHaveBeenCalled();
});
