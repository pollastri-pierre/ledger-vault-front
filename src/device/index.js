// @flow
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";
import { registerTransportModule } from "@ledgerhq/live-common/lib/hw";

import { softwareMode } from "device/interface";

export const CURRENT_APP_NAME = "Vault";
export const U2F_PATH = [0x80564c54, 0x80553246];
export const CONFIDENTIALITY_PATH = [0x80564c54, 0x80434e46];
export const VALIDATION_PATH = [0x80564c54, 0x8056414c];
export const KEY_MATERIAL_PATH = [0x80564c54, 0x804b4559];
export const MATCHER_SESSION = 0x01;
export const ACCOUNT_MANAGER_SESSION = 0x02;
export const INIT_SESSION = 0x03;
export const U2F_TIMEOUT = "U2F_5";
export const INVALID_DATA = 27264;
export const DEVICE_REJECT_ERROR_CODE = 27013;
export const APPID_VAULT_BOOTSTRAP =
  "1e55aaa3241c6f9b630d3a53c6aa6877695fd0e0c6c7bbc0f8eed35bcb43ebe0";
export const APPID_VAULT_ADMINISTRATOR =
  "ad5be1a1fe011ce7f53ae081a22ae000a42021f3f94106a3bac9f76e8230e4b9";

export const fromStringRoleToBytes = {
  shared_owner: Buffer.from([2]),
  admin: Buffer.from([1]),
  operator: Buffer.from([0]),
};

const USE_TRANSPORT_U2F = true; // localStorage.getItem("U2F");
const FORCE_WEB_USB = localStorage.getItem("FORCE_WEB_USB") === "1";
const mockTransport = Promise.resolve({ close: () => Promise.resolve() });

if (USE_TRANSPORT_U2F && !FORCE_WEB_USB) {
  registerTransportModule({
    id: "u2f",
    open: async () => {
      // $FlowFixMe
      if (softwareMode()) return mockTransport;
      // $FlowFixMe
      const t = await LedgerTransportU2F.create();
      t.setScrambleKey("v1+");
      t.setUnwrap(true);
      t.setExchangeTimeout(360000);
      return t;
    },
    disconnect: () => null,
  });
} else {
  registerTransportModule({
    id: "webusb",
    open: async () => {
      // $FlowFixMe
      if (softwareMode()) return mockTransport;
      const t = await TransportUSB.create();
      return t;
    },
    disconnect: () => null,
  });
}
