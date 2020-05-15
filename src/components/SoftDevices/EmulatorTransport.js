// @flow

import { TransportError } from "@ledgerhq/errors";
import WebSocketTransport from "@ledgerhq/hw-transport-http/lib/WebSocketTransport";

export default {
  open: async (url: string) => {
    const hook = await new Promise((resolve, reject) => {
      try {
        const socket = new WebSocket(url);
        const exchangeMethods = {
          resolveExchange: (_b: Buffer) => {},
          rejectExchange: (_e: *) => {},
          onDisconnect: () => {},
          close: () => socket.close(),
          send: (msg) => {
            const msgBuffer = Buffer.from(msg, "hex");
            const size = msgBuffer.length;
            const sizeBuffer = Buffer.allocUnsafe(4);
            sizeBuffer.writeUIntBE(size, 0, 4);
            const final = Buffer.concat([sizeBuffer, msgBuffer], size + 4);
            const bin = Uint8Array.from(final);
            socket.send(bin);
          },
        };
        socket.onopen = () => {
          resolve(exchangeMethods);
        };
        socket.onerror = (e) => {
          exchangeMethods.onDisconnect();
          reject(e);
        };
        socket.onclose = () => {
          exchangeMethods.onDisconnect();
          reject(new TransportError("OpenFailed", "OpenFailed"));
        };
        socket.onmessage = async (e) => {
          // $FlowFixMe yes yes I know
          const data = await e.data.arrayBuffer();
          const sizeBuf = Buffer.from(data.slice(0, 4));
          const size = sizeBuf.readUIntBE(0, 4);

          if (size + 2 + 4 !== data.byteLength) {
            console.warn("Different sizes dudud");
          }

          const res = Buffer.from(data.slice(4, size + 4 + 2));
          return exchangeMethods.resolveExchange(res);
        };
      } catch (e) {
        reject(e);
      }
    });

    return new WebSocketTransport(hook);
  },
};
