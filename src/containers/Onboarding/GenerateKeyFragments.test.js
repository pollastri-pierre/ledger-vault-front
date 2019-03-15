import {
  CONFIDENTIALITY_PATH,
  KEY_MATERIAL_PATH,
  INIT_SESSION,
  ACCOUNT_MANAGER_SESSION,
} from "device";
import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import VaultDeviceApp, {
  mockGetPublicKey, // eslint-disable-line
  mockOpenSession, // eslint-disable-line
  mockGetVersion, // eslint-disable-line
  mockGetAttestationCertificate, // eslint-disable-line
  mockGenerateKeyComponent, // eslint-disable-line
} from "device/VaultDeviceApp";
import { GenerateKeyFragments } from "./GenerateKeyFragments";

jest.mock("device/VaultDeviceApp");
jest.mock("@ledgerhq/hw-transport-u2f", () => ({
  create: jest.fn(),
}));

jest.mock("network", () => jest.fn());

beforeEach(() => {
  VaultDeviceApp.mockClear();
  mockGetPublicKey.mockClear();
  mockGetVersion.mockClear();
  mockOpenSession.mockClear();
  mockGenerateKeyComponent.mockClear();
});

Enzyme.configure({ adapter: new Adapter() });

const props = {
  onFinish: jest.fn(),
  wraps: true,
  shards_channel: {
    ephemeral_public_key: "shards_pub_key",
    ephemeral_certificate: "shards_certificate",
  },
};

test("onStart should call device and API with right parameters for wrapping INIT_SESSION", async () => {
  const MyComponent = shallow(
    <GenerateKeyFragments t={string => string} {...props} />,
  );
  await MyComponent.instance().start();
  expect(mockGetVersion).toHaveBeenCalled();
  expect(mockGetPublicKey).toHaveBeenCalledWith(CONFIDENTIALITY_PATH);

  expect(mockOpenSession).toHaveBeenCalledWith(
    CONFIDENTIALITY_PATH,
    Buffer.from("shards_pub_key", "hex"),
    Buffer.from("shards_certificate", "base64"),
    INIT_SESSION,
  );

  expect(mockGenerateKeyComponent).toHaveBeenCalledWith(
    KEY_MATERIAL_PATH,
    true,
  );

  const certificate =
    "6fc65a01643a104bbed2a82dc0d87c88a353c7e438c0fb7a0796c04337a022bb04efc11ec4ece4ac5d3e16ba7740f5692480dcb8ff79537daf5a812fd53d84ab6c460f4ca1529719d1d95d6dd38a2532eedd27d339798d05a1ae2b7d9741973a2930440220";
  expect(props.onFinish).toHaveBeenCalledWith({
    ephemeral_public_key: "pubKey",
    certificate,
    blob: "seedShard",
  });
});

test("onStart should call device and API with right parameters when generating seeds ACCOUNT_MANAGER_SESSION", async () => {
  const sProps = { ...props, wraps: false };
  const MyComponent = shallow(
    <GenerateKeyFragments t={string => string} {...sProps} />,
  );
  await MyComponent.instance().start();
  expect(mockGetPublicKey).toHaveBeenCalledWith(CONFIDENTIALITY_PATH);
  expect(mockGetAttestationCertificate).toHaveBeenCalledWith();

  expect(mockOpenSession).toHaveBeenCalledWith(
    CONFIDENTIALITY_PATH,
    Buffer.from("shards_pub_key", "hex"),
    Buffer.from("shards_certificate", "base64"),
    ACCOUNT_MANAGER_SESSION,
  );

  expect(mockGenerateKeyComponent).toHaveBeenCalledWith(
    KEY_MATERIAL_PATH,
    false,
  );

  const certificate =
    "6fc65a01643a104bbed2a82dc0d87c88a353c7e438c0fb7a0796c04337a022bb04efc11ec4ece4ac5d3e16ba7740f5692480dcb8ff79537daf5a812fd53d84ab6c460f4ca1529719d1d95d6dd38a2532eedd27d339798d05a1ae2b7d9741973a2930440220";
  expect(props.onFinish).toHaveBeenCalledWith({
    ephemeral_public_key: "pubKey",
    certificate,
    blob: "seedShard",
  });
});
