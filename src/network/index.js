//@flow
import fetchWithRetries from "./fetchWithRetries";
import { getLocalStorageToken } from "../redux/modules/auth";

export function NetworkError(obj: *) {
  this.name = "NetworkError";
  Object.assign(this, obj);
}
NetworkError.prototype = Object.create(Error.prototype);

export default function<T>(
  uri: string,
  method: string,
  body: ?(Object | Array<Object>),
  external: boolean = false
): Promise<T> {
  const token = getLocalStorageToken();
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && !external ? { "X-Ledger-Auth": token } : {})
  };
  const options: Object = { headers, method };
  if (method !== "GET" && body) {
    options.body = JSON.stringify(body);
  }
  return fetchWithRetries(uri, options, external).then(response => {
    if (response.status < 200 || response.status >= 300) {
      const baseErrorObject = {
        message: "network error",
        status: response.status
      };
      return response
        .json()
        .then(
          json => new NetworkError({ ...baseErrorObject, json }),
          () => new NetworkError(baseErrorObject)
        )
        .then(e => Promise.reject(e));
    }
    return response.json();
  });
}
