// @flow
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import { registerTransportModule } from "@ledgerhq/live-common/lib/hw";
import type Transport from "@ledgerhq/hw-transport";

import { createEmulatorTransport } from "components/SoftDevices";

export const CURRENT_APP_NAME = "Vault";
export const U2F_PATH = [0x80564c54, 0x80553246];
export const CONFIDENTIALITY_PATH = [0x80564c54, 0x80434e46];
export const VALIDATION_PATH = [0x80564c54, 0x8056414c];
export const KEY_MATERIAL_PATH = [0x80564c54, 0x804b4559];
export const MATCHER_SESSION = 0x01;
export const ACCOUNT_MANAGER_SESSION = 0x02;
export const INIT_SESSION = 0x03;
export const U2F_TIMEOUT = "U2F_5";
export const STREAMING_RESPONSE = 0x02;
export const STREAMING_NEXT_ACTION = 0x01;
export const INVALID_DATA = 27264;
export const DEVICE_REJECT_ERROR_CODE = 27013;
export const INVALID_OR_MISSING_ATTESTATION = 0x6801;
export const APPID_VAULT_BOOTSTRAP =
  "1e55aaa3241c6f9b630d3a53c6aa6877695fd0e0c6c7bbc0f8eed35bcb43ebe0";
export const APPID_VAULT_ADMINISTRATOR =
  "ad5be1a1fe011ce7f53ae081a22ae000a42021f3f94106a3bac9f76e8230e4b9";

export const fromStringRoleToBytes = {
  shared_owner: Buffer.from([2]),
  admin: Buffer.from([1]),
  operator: Buffer.from([0]),
};

const all61xxStatus = [];
for (let i = 0x6100; i <= 0x61ff; i++) {
  all61xxStatus.push(i);
}
export const PAGINATED_STATUS = all61xxStatus;

// $FlowFixMe
const mockTransport: Promise<Transport<*>> = Promise.resolve({
  close: () => Promise.resolve(),
});

registerTransportModule({
  id: "u2f",
  open: (id: string) => {
    if (id !== "u2f") return;

    return TransportU2F.create().then((t) => {
      t.setScrambleKey("v1+");
      // $FlowFixMe
      t.setUnwrap(true);
      t.setExchangeTimeout(360000);
      return t;
    });
  },
  disconnect: () => null,
});

registerTransportModule({
  id: "software",
  open: (id: string) => {
    if (id !== "software") return;
    return mockTransport;
  },
  disconnect: () => null,
});

registerTransportModule({
  id: "webusb",
  open: (id: string) => {
    if (id !== "webusb") return;
    return TransportUSB.create();
  },
  disconnect: () => null,
});

registerTransportModule({
  id: "weblue",
  open: (id: string) => {
    if (id !== "weblue") return;
    return createEmulatorTransport();
  },
  disconnect: () => null,
});
