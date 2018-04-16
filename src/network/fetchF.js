//@flow
let fetchF;

if (process.env.NODE_ENV !== "development") {
  fetchF = fetch;
} else {
  fetchF = (uri: string, options: Object): Promise<*> => {
    let prefix = location.pathname.split("/")[1];
    if (prefix !== "") {
      prefix = "/" + prefix;
    }
    return fetch("https://localhost:5000" + prefix + uri, options);
  };
}

export default fetchF;
