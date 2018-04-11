import {
  CONFIDENTIALITY_PATH,
  APPID_VAULT_ADMINISTRATOR,
  U2F_PATH,
  VALIDATION_PATH
} from "device";
jest.mock("device/VaultDeviceApp");
jest.mock("@ledgerhq/hw-transport-u2f", () => ({
  create: jest.fn()
}));

import network from "network";
jest.mock("network", () => jest.fn());

beforeEach(() => {
  VaultDeviceApp.mockClear();
  mockGetPublicKey.mockClear();
  mockRegister.mockClear();
});
import React from "react";
import { StepDevice } from "./StepDevice";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import VaultDeviceApp, {
  mockGetPublicKey,
  mockRegister
} from "device/VaultDeviceApp";

Enzyme.configure({ adapter: new Adapter() });

const props = {
  title: "title",
  steps: ["test1", "test2", "test3"],
  cancel: jest.fn(),
  finish: jest.fn(),
  challenge: "challenge",
  data: {
    first_name: { value: "first_name" },
    last_name: { value: "last_name" },
    email: { value: "email" },
    picture: { value: null }
  },
  registerKeyHandle: jest.fn()
};

test("onStart should call device and API with right parameters", async () => {
  const MyComponent = shallow(<StepDevice {...props} />);
  await MyComponent.instance().onStart();
  expect(mockGetPublicKey).toHaveBeenCalledWith(U2F_PATH, false);
  expect(mockGetPublicKey).toHaveBeenCalledWith(CONFIDENTIALITY_PATH);
  expect(mockGetPublicKey).toHaveBeenCalledWith(VALIDATION_PATH);

  expect(mockRegister).toHaveBeenCalledWith(
    Buffer.from("challenge", "base64"),
    APPID_VAULT_ADMINISTRATOR,
    "",
    "",
    "",
    ""
  );

  expect(props.registerKeyHandle).toHaveBeenCalledWith("pubKey", ["handle1"]);

  expect(network).toHaveBeenCalledWith("/onboarding/authenticate", "POST", {
    confidentiality: { attestation: "signature", public_key: "pubKey" },
    email: "email",
    first_name: "first_name",
    key_handle: "handle1",
    last_name: "last_name",
    picture: null,
    pub_key: "pubKey",
    u2f_register: "raw",
    validation: { attestation: "signature", public_key: "pubKey" }
  });
});
