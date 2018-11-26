//@flow
let fetchF;
import mockAPI from "data/mock-api";
import { ENDPOINTS } from "device/VaultDeviceHTTP";

const baseUrl = process.env["API_BASE_URL"] || "https://vault.ledger.com";
const needGatePrefix = prefix =>
  prefix !== "" &&
  !["development", "e2e", "beta"].includes(process.env.NODE_ENV); //WARNING includes not IE compatible but we don't care :)

if (process.env.NODE_ENV === "test") {
  fetchF = mockAPI;
} else {
  fetchF = (uri: string, options: Object): Promise<*> => {
    let prefix = location.pathname.split("/")[1];
    // endpoints for mock device API
    if (Object.values(ENDPOINTS).indexOf(uri) > -1) {
      return fetch("http://localhost:5001" + uri, options);
    }
    if (needGatePrefix(prefix)) {
      prefix = "/gate/" + prefix;
    } else {
      prefix = "/" + prefix;
    }
    return fetch(baseUrl + prefix + uri, options);
  };
}
export default fetchF;
