//@flow
let fetchF;
import mockAPI from "data/mock-api";

if (process.env.NODE_ENV === "test") {
  fetchF = mockAPI;
} else if (process.env.NODE_ENV !== "development") {
  fetchF = (uri: string, options: Object): Promise<*> => {
    let prefix = location.pathname.split("/")[1];
    if (prefix !== "") {
      prefix = "/" + prefix;
    }
    return fetch("https://localhost:5000" + prefix + uri, options);
  };
} else {
  fetchF = fetch;
}

export default fetchF;
