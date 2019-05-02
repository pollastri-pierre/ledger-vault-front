// @flow
import type { DeviceError } from "utils/errors";
import { getLocalStorageToken } from "../redux/modules/auth";
import fetchF from "./fetchF";

export function NetworkError(obj: *) {
  this.name = "NetworkError";
  Object.assign(this, obj);
}
NetworkError.prototype = Object.create(Error.prototype);

export default function<T>(
  uri: string,
  method: string,
  body: ?(Object | Array<Object>),
  tokenParam: ?string,
  fetchParams: Object,
): Promise<T> {
  const token = tokenParam || getLocalStorageToken();
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { "X-Ledger-Auth": token } : {}),
  };
  const options: Object = { headers, method };
  if (method !== "GET" && body) {
    options.body = JSON.stringify(body);
  }
  return fetchF(uri, options, fetchParams).then(response => {
    if (response.status < 200 || response.status >= 300) {
      const baseErrorObject = {
        message: "network error",
        status: response.status,
      };
      return response
        .json()
        .then(
          json => new NetworkError({ ...baseErrorObject, json }),
          () => new NetworkError(baseErrorObject),
        )
        .then(e => Promise.reject(e));
    }
    return response.json();
  });
}

export const delay = (ms: number): Promise<void> =>
  new Promise(f => setTimeout(f, ms));

const defaults = {
  maxRetry: 4,
  interval: 300,
  intervalMultiplicator: 1.5,
};
export function retry<A>(
  f: () => Promise<A>,
  options?: $Shape<typeof defaults>,
): Promise<A> {
  const { maxRetry, interval, intervalMultiplicator } = {
    ...defaults,
    ...options,
  };

  return rec(maxRetry, interval);

  function rec(remainingTry, interval) {
    const result = f();
    if (remainingTry <= 0) {
      return result;
    }
    // In case of failure, wait the interval, retry the action
    return result.catch(e => {
      console.warn("retry failed", e.message);
      return delay(interval).then(() =>
        rec(remainingTry - 1, interval * intervalMultiplicator),
      );
    });
  }
}

type CancellablePollingOpts = {
  pollingInterval?: number,
  shouldThrow?: DeviceError => boolean,
};

export function retryOnCondition(
  job: any => Promise<any>,
  { pollingInterval = 500, shouldThrow }: CancellablePollingOpts = {},
): Promise<any> {
  const promise = new Promise((resolve, reject) => {
    async function poll() {
      try {
        const res = await job();
        resolve(res);
      } catch (err) {
        if (shouldThrow && shouldThrow(err)) {
          reject(err);
          return;
        }
        await delay(pollingInterval);
        poll();
      }
    }
    poll();
  });
  return promise;
}
