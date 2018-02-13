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
  }
};

test("onStart should call device and API with right parameters", async () => {
  const MyComponent = shallow(<StepDevice {...props} />);
  await MyComponent.instance().onStart();
  expect(mockGetPublicKey).toHaveBeenCalledWith(U2F_PATH);
  expect(mockGetPublicKey).toHaveBeenCalledWith(CONFIDENTIALITY_PATH);
  expect(mockGetPublicKey).toHaveBeenCalledWith(VALIDATION_PATH);

  const challenge_answer = {
    rfu: "rfu",
    pubKey: "pubKey",
    keyHandle: ["handle1"],
    attestationSignature: "attestationSignature",
    signature: "signature"
  };

  expect(mockRegister).toHaveBeenCalledWith(
    "challenge",
    APPID_VAULT_ADMINISTRATOR,
    "_",
    "_",
    "_",
    "_"
  );

  expect(network).toHaveBeenCalledWith(
    "/provisioning/administrators/register",
    "POST",
    {
      challenge_answer: challenge_answer,
      confidentiality_attestation: "signature",
      confidentiality_key: "pubKey",
      validation_key: "pubKey",
      validation_attestation: "signature",
      email: "email",
      first_name: "first_name",
      last_name: "last_name",
      picture: null,
      pub_key: { pubKey: "pubKey", signature: "signature" }
    }
  );
});
