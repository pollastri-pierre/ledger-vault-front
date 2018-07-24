//@flow
let fetchF;
import mockAPI from "data/mock-api";

const baseUrl = process.env["API_BASE_URL"];
if (process.env.NODE_ENV === "test") {
  fetchF = mockAPI;
} else {
  fetchF = (uri: string, options: Object): Promise<*> => {
    let prefix = location.pathname.split("/")[1];
    if (prefix !== "" && process.env.NODE_ENV !== "development") {
      prefix = "/gate/" + prefix;
    } else {
      prefix = "/" + prefix;
    }
    console.log(baseUrl);
    return fetch(baseUrl + prefix + uri, options);
  };
}
export default fetchF;
