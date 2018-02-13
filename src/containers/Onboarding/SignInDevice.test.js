import { APPID_VAULT_BOOTSTRAP, U2F_PATH } from "device";
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
  challenge: { challenge: "challenge", handles: ["handle1"] }
};

test("onStart should call device and API with right parameters", async () => {
  const MyComponent = shallow(<SignInDevice {...props} />);
  await MyComponent.instance().start();
  expect(mockGetPublicKey).toHaveBeenCalledWith(U2F_PATH);

  expect(mockAuthenticate).toHaveBeenCalledWith(
    "challenge",
    APPID_VAULT_BOOTSTRAP,
    "handle1",
    "_",
    "_",
    "_",
    "_"
  );

  expect(props.onFinish).toHaveBeenCalledWith(
    { pubKey: "pubKey", signature: "signature" },
    {
      rawResponse: "raw",
      counter: 0,
      userPresence: "userPresence",
      signature: "signature"
    }
  );
});
