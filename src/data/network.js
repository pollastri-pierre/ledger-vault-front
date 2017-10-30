//@flow

// TODO: we need to factorize the promises PER uri. so calling twice getJSON("/accounts") will do one underlying call
// TODO we need to use something like https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/fetch/fetchWithRetries.js

export function getJSON(uri: string): Promise<Object | Array<*>> {
  return fetch(uri, {
    headers: { "X-Ledger-Auth": window.localStorage.getItem("token") }
  }).then(response => {
    if (response.status < 200 || response.status >= 300)
      throw new Error("status=" + response.status);
    return response.json();
  });
}

export function sendJSON(
  uri: string,
  method: string,
  body: ?Object
): Promise<Object | Array<*>> {
  return fetch(uri, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "X-Ledger-Auth": window.localStorage.getItem("token"),
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then(response => {
    console.warn(`FAILED ${method} ${uri}`, body);
    if (response.status < 200 || response.status >= 300)
      throw new Error("status=" + response.status);
    return response.json();
  });
}
