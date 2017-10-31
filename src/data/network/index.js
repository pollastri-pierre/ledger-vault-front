//@flow
import fetchWithRetries from "./fetchWithRetries";
import groupConcurrentPromise from "./groupConcurrentPromise";

export default function(
  uri: string,
  method: string,
  body: ?Object
): Promise<Object | Array<*>> {
  if (method === "GET") {
    return groupConcurrentPromise(uri, () =>
      fetchWithRetries(uri, {
        headers: { "X-Ledger-Auth": window.localStorage.getItem("token") }
      })
    ).then(response => {
      if (response.status < 200 || response.status >= 300)
        throw new Error("status=" + response.status);
      return response.json();
    });
  } else {
    return fetchWithRetries(uri, {
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
}
