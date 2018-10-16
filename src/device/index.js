// @flow
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";
import VaultDeviceApp from "./VaultDeviceApp";
import VaultDeviceHTTP from "./VaultDeviceHTTP";
export const CURRENT_APP_NAME = "Vault";
export const CURRENT_APP_VERSION = process.env["APP_VERSION"] || "1.0.13";

export const U2F_PATH = [0x80564c54, 0x80553246];
export const CONFIDENTIALITY_PATH = [0x80564c54, 0x80434e46];
export const VALIDATION_PATH = [0x80564c54, 0x8056414c];
export const KEY_MATERIAL_PATH = [0x80564c54, 0x804b4559];
export const MATCHER_SESSION = 0x01;
export const ACCOUNT_MANAGER_SESSION = 0x02;
export const INIT_SESSION = 0x03;
export const U2F_TIMEOUT = "U2F_5";
export const INVALID_DATA = 27264;

export const APPID_VAULT_BOOTSTRAP =
  "1e55aaa3241c6f9b630d3a53c6aa6877695fd0e0c6c7bbc0f8eed35bcb43ebe0";
export const APPID_VAULT_ADMINISTRATOR =
  "ad5be1a1fe011ce7f53ae081a22ae000a42021f3f94106a3bac9f76e8230e4b9";

export const checkToUpdate = async (
  device: VaultDeviceApp,
  callback: Function
): Promise<*> => {
  try {
    const { appName, appVersion } = await device.getVersion();
    console.log(appVersion);
    if (appName !== CURRENT_APP_NAME || appVersion !== CURRENT_APP_VERSION) {
      callback();
      return false;
    }
    return true;
  } catch (error) {
    if (error && error.id === U2F_TIMEOUT) {
      // timeout we retry
      await checkToUpdate(device, callback);
    }
  }
};

export default async (scrambleKey: string = "v1+"): Promise<VaultDeviceApp> => {
  if (process.env.NODE_ENV === "e2e") {
    //$FlowFixMe
    return new VaultDeviceHTTP();
  }
  const transport = await LedgerTransportU2F.create(90000000, 90000000);
  return new VaultDeviceApp(transport, scrambleKey);
};
