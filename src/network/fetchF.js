// @flow
import mockAPI from "data/mock-api";
import { ENDPOINTS } from "device/VaultDeviceHTTP";
import { minWait } from "utils/promise";

let fetchF; // eslint-disable-line import/no-mutable-exports
const DEMO_DELAY = 0; // put 1000 for demos ahah

if (process.env.NODE_ENV === "test") {
  fetchF = mockAPI;
} else {
  fetchF = (uri: string, options: Object): Promise<*> => {
    let prefix = location.pathname.split("/")[1];
    // endpoints for mock device API
    if (Object.values(ENDPOINTS).indexOf(uri) > -1) {
      return minWait(fetch(`http://localhost:5001${uri}`, options), DEMO_DELAY);
    }
    prefix = `/${prefix}`;
    if (process.env.NODE_ENV !== "production") {
      return (
        mockAPI(uri, options) ||
        fetch(window.config.API_BASE_URL + prefix + uri, options)
      );
    }
    return fetch(window.config.API_BASE_URL + prefix + uri, options);
  };
}
export default fetchF;
