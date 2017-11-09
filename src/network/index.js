//@flow
import fetchWithRetries from "./fetchWithRetries";

export function NetworkError(obj: *) {
  this.name = "NetworkError";
  Object.assign(this, obj);
}
NetworkError.prototype = Object.create(Error.prototype);

export default function(
  uri: string,
  method: string,
  body: ?(Object | Array<Object>)
): Promise<Object | Array<*>> {
  const headers = {
    "X-Ledger-Auth": window.localStorage.getItem("token"),
    Accept: "application/json",
    "Content-Type": "application/json"
  };
  const options: Object = { headers, method };
  if (method !== "GET" && body) {
    options.body = JSON.stringify(body);
  }
  return fetchWithRetries(uri, options).then(response => {
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
