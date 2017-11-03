//@flow
import fetchWithRetries from "./fetchWithRetries";
import groupConcurrentPromise from "./groupConcurrentPromise";

export function NetworkError(obj: *) {
  this.name = "NetworkError";
  Object.assign(this, obj);
}
NetworkError.prototype = Object.create(Error.prototype);

export default function(
  uri: string,
  method: string,
  body: ?Object
): Promise<Object | Array<*>> {
  const headers = {
    "X-Ledger-Auth": window.localStorage.getItem("token"),
    Accept: "application/json",
    "Content-Type": "application/json"
  };
  return (method === "GET"
    ? groupConcurrentPromise(uri, () => fetchWithRetries(uri, { headers }))
    : fetchWithRetries(uri, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      })
  ).then(response => {
    if (response.status < 200 || response.status >= 300) {
      const baseErrorObject = {
        message: "network error",
        status: response.status
      };
      throw response
        .json()
        .then(json => new NetworkError({ ...baseErrorObject, json }))
        .catch(() => new NetworkError(baseErrorObject));
    }
    return response.json();
  });
}
