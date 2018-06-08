import { CONFIDENTIALITY_PATH, KEY_MATERIAL_PATH } from "device";
jest.mock("device/VaultDeviceApp");
jest.mock("@ledgerhq/hw-transport-u2f", () => ({
  create: jest.fn()
}));

jest.mock("network", () => jest.fn());

beforeEach(() => {
  VaultDeviceApp.mockClear();
  mockGetPublicKey.mockClear();
  mockOpenSession.mockClear();
  mockGenerateKeyComponent.mockClear();
});
import React from "react";
import { GenerateSeed } from "./GenerateSeed";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import VaultDeviceApp, {
  mockGetPublicKey,
  mockOpenSession,
  mockGenerateKeyComponent
} from "device/VaultDeviceApp";

Enzyme.configure({ adapter: new Adapter() });

const props = {
  onFinish: jest.fn(),
  wraps: true,
  shards_channel: {
    ephemeral_public_key: "shards_pub_key",
    ephemeral_certificate: "shards_certificate"
  }
};

test("onStart should call device and API with right parameters", async () => {
  const MyComponent = shallow(<GenerateSeed t={string => string} {...props} />);
  await MyComponent.instance().start();
  expect(mockGetPublicKey).toHaveBeenCalledWith(CONFIDENTIALITY_PATH);

  expect(mockOpenSession).toHaveBeenCalledWith(
    CONFIDENTIALITY_PATH,
    Buffer.from("shards_pub_key", "hex"),
    Buffer.from("shards_certificate", "base64")
  );

  expect(mockGenerateKeyComponent).toHaveBeenCalledWith(
    KEY_MATERIAL_PATH,
    true
  );

  expect(props.onFinish).toHaveBeenCalledWith({
    ephemeral_public_key: "pubKey",
    certificate: "signature",
    blob: "seedShard"
  });
});
