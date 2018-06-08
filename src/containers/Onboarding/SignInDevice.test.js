import { APPID_VAULT_ADMINISTRATOR, U2F_PATH } from "device";
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
import { SignInDevice } from "./SignInDevice";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import VaultDeviceApp, {
  mockGetPublicKey,
  mockAuthenticate
} from "device/VaultDeviceApp";

Enzyme.configure({ adapter: new Adapter() });

const props = {
  onFinish: jest.fn(),
  t: string => string,
  keyHandles: { pubKey: "handle1" },
  challenge: { challenge: "challenge", key_handle: { pubKey: "handle1" } }
};

test("onStart should call device and API with right parameters", async () => {
  const MyComponent = shallow(<SignInDevice {...props} />);
  await MyComponent.instance().start();
  expect(mockGetPublicKey).toHaveBeenCalledWith(U2F_PATH, false);

  expect(mockAuthenticate).toHaveBeenCalledWith(
    Buffer.from("challenge", "base64"),
    APPID_VAULT_ADMINISTRATOR,
    Buffer.from("handle1", "hex")
  );

  expect(props.onFinish).toHaveBeenCalledWith("pubKey", {
    rawResponse: "raw",
    counter: 0,
    userPresence: "userPresence",
    signature: "signature"
  });
});
