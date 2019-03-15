// @flow

import invariant from "invariant";
import { Observable } from "rxjs";

/**
 * use Ledger WebSocket API to exchange data with the device
 * Returns an Observable of the final result
 */
export const createDeviceSocket = (
  transport: *,
  url: string,
): Observable<string> =>
  Observable.create(o => {
    let ws;
    let lastMessage: ?string;

    try {
      ws = new WebSocket(url);
    } catch (err) {
      o.error();
      console.error(err);
      return () => {};
    }
    invariant(ws, "websocket is available");

    ws.onclose = () => {
      o.next(lastMessage || "");
      o.complete();
    };

    ws.onerror = () => {
      o.error();
    };
    ws.onmessage = event => {
      switch (event.type) {
        case "message": {
          stackMessage(event.data);
          break;
        }
      }
    };

    const send = (nonce, response, data) => {
      const msg = {
        nonce,
        response,
        data,
      };
      const strMsg = JSON.stringify(msg);
      ws.send(strMsg);
    };

    const handlers = {
      exchange: async input => {
        const { data, nonce } = input;
        const r: Buffer = await transport.exchange(Buffer.from(data, "hex"));
        const status = r.slice(r.length - 2);
        const buffer = r.slice(0, r.length - 2);
        const strStatus = status.toString("hex");
        send(
          nonce,
          strStatus === "9000" ? "success" : "error",
          buffer.toString("hex"),
        );
      },

      bulk: async input => {
        const { data, nonce } = input;

        // Execute all apdus and collect last status
        let lastStatus = null;
        for (const apdu of data) {
          const r: Buffer = await transport.exchange(Buffer.from(apdu, "hex"));
          lastStatus = r.slice(r.length - 2);

          if (lastStatus.toString("hex") !== "9000") break;
        }

        if (!lastStatus) {
          throw new Error();
          // throw new DeviceSocketNoBulkStatus();
        }

        const strStatus = lastStatus.toString("hex");

        send(
          nonce,
          strStatus === "9000" ? "success" : "error",
          strStatus === "9000" ? "" : strStatus,
        );
      },

      success: msg => {
        lastMessage = msg.data || msg.result;
        ws.close();
      },

      error: msg => {
        console.error("ERROR", { data: msg.data });
        o.error();
      },
    };

    const stackMessage = async rawMsg => {
      try {
        if (typeof rawMsg === "string") {
          const msg = JSON.parse(rawMsg);
          if (!(msg.query in handlers)) {
            throw new Error();
          }
          await handlers[msg.query](msg);
        } else {
          throw new Error();
        }
      } catch (err) {
        console.error("ERROR", { message: err.message, stack: err.stack });
        o.error(err);
      }
    };

    return () => {
      if (ws.readyState === 1) {
        lastMessage = null;
        ws.close();
      }
    };
  });
