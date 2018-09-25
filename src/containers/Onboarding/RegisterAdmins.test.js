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

beforeEach(() => {
  VaultDeviceApp.mockClear();
  mockGetPublicKey.mockClear();
  mockRegister.mockClear();
});
import React from "react";
import { RegisterAdmins } from "./RegisterAdmins";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import VaultDeviceApp, {
  mockGetPublicKey,
  mockGetAttestationCertificate,
  mockRegister
} from "device/VaultDeviceApp";

Enzyme.configure({ adapter: new Adapter() });

const props = {
  title: "title",
  steps: ["test1", "test2", "test3"],
  cancel: jest.fn(),
  finish: jest.fn(),
  challenge: "ynIePNFTbB0feH6S1Veq3avFGLM6LrScX9d0g4t6ElU=",
  data: {
    first_name: "first_name",
    last_name: "last_name",
    email: "email",
    picture: null
  },
  organization: {
    name: "name",
    workspace: "workspace",
    domain_name: "ledger.com"
  },
  registerKeyHandle: jest.fn()
};
//
test("onStart should call device and API with right parameters", async () => {
  // TODO test with real bufer values for u2f_register
  // to test the certification is properly inserted in the middle
  const MyComponent = shallow(<RegisterAdmins {...props} />);
  MyComponent.instance().componentDidMount(); // force mount to set _isMounted
  await MyComponent.instance().onStart();
  expect(mockGetPublicKey).toHaveBeenCalledWith(U2F_PATH, false);
  expect(mockGetPublicKey).toHaveBeenCalledWith(CONFIDENTIALITY_PATH);
  expect(mockGetPublicKey).toHaveBeenCalledWith(VALIDATION_PATH);
  expect(mockGetAttestationCertificate).toHaveBeenCalledWith();

  expect(mockRegister).toHaveBeenCalledWith(
    Buffer.from("ynIePNFTbB0feH6S1Veq3avFGLM6LrScX9d0g4t6ElU=", "base64"),
    APPID_VAULT_ADMINISTRATOR,
    "name",
    "workspace",
    "ledger.com",
    "Administrator"
  );

  const validation = Buffer.concat([
    Buffer.from(
      "6fc65a01643a104bbed2a82dc0d87c88a353c7e438c0fb7a0796c04337a022bb04efc11ec4ece4ac5d3e16ba7740f5692480dcb8ff79537daf5a812fd53d84ab6c460f4ca1529719d1d95d6dd38a2532eedd27d339798d05a1ae2b7d9741973a2930440220",
      "hex"
    ),
    Buffer.from("signature", "hex")
  ]);

  const confidentiality = Buffer.concat([
    Buffer.from(
      "6fc65a01643a104bbed2a82dc0d87c88a353c7e438c0fb7a0796c04337a022bb04efc11ec4ece4ac5d3e16ba7740f5692480dcb8ff79537daf5a812fd53d84ab6c460f4ca1529719d1d95d6dd38a2532eedd27d339798d05a1ae2b7d9741973a2930440220",
      "hex"
    ),
    Buffer.from("signature", "hex")
  ]);
  const u2f_register = Buffer.from(
    "0504606b50147502fb26bc346b1fd02af837c897c68b7059d0f31587fc8e3fbd003d555ddaace2ad2b0a17c0d298e4ff925c9eb3b450ac8bce3d1bb8cfea3647fc4340138f86ab87380962decb37598f5a83ac44e83e7e6b03edee4dfb354000394779ceddd950d2bb7696c4abb469edb507112ce8822935b3604e361666235a942714a7780bf0d00c19e477afa2391aca6cc7dec19ac7abe9bc69f06080af36b100b3d2022033a5e6e2ffd08b8c707d2019ef78dfea400da6df5b9862cd8a1a5c5d72281ac93044022015547b728a266a209bed07b3934232c35edcde550e68ea7792ceb8d7963f490e022021d354aa36e29219cf5fe3fb1704a582f9eeac51ad07a2f9b25be5148a7f8538",
    "hex"
  );
  const attestationOffset = 67 + u2f_register.readInt8(66);
  const attestation = Buffer.from(
    "6fc65a01643a104bbed2a82dc0d87c88a353c7e438c0fb7a0796c04337a022bb04efc11ec4ece4ac5d3e16ba7740f5692480dcb8ff79537daf5a812fd53d84ab6c460f4ca1529719d1d95d6dd38a2532eedd27d339798d05a1ae2b7d9741973a2930440220",
    "hex"
  );

  const u2f_register_attestation = Buffer.concat([
    u2f_register.slice(0, attestationOffset),
    Buffer.from([attestation.length]),
    attestation,
    u2f_register.slice(attestationOffset)
  ]);

  expect(props.finish).toHaveBeenCalledWith({
    confidentiality: {
      attestation: confidentiality.toString("hex"),
      public_key: "pubKey"
    },
    email: "email",
    first_name: "first_name",
    key_handle:
      "1d45df520d9bb6834f0f0652456ed7a80f2d3068152329a31a07dee89f5f8525cfa7df315e83155dc39d0b5098f5313a70752c96b4c99af60b03bdc77b52f54c",
    last_name: "last_name",
    picture: null,
    pub_key: "pubKey",
    u2f_register: u2f_register_attestation.toString("hex"),
    validation: {
      attestation: validation.toString("hex"),
      public_key: "pubKey"
    }
  });
});
