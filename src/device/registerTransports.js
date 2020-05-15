// @flow
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import { registerTransportModule } from "@ledgerhq/live-common/lib/hw";
import type Transport from "@ledgerhq/hw-transport";

import { createEmulatorTransport } from "components/SoftDevices";

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
