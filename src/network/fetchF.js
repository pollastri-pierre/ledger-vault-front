// @flow
import { ENDPOINTS } from "device/VaultDeviceHTTP";
import { minWait } from "utils/promise";

let fetchF; // eslint-disable-line import/no-mutable-exports
const DEMO_DELAY = 0; // put 1000 for demos ahah

let mockAPI;

if (process.env.NODE_ENV !== "production") {
  mockAPI = require("data/mock-api").default;
}

if (process.env.NODE_ENV === "test") {
  fetchF = mockAPI;
} else {
  fetchF = (uri: string, options: Object, params: Object = {}): Promise<*> => {
    let prefix = params.prefix || location.pathname.split("/")[1];
    // endpoints for mock device API
    if (Object.values(ENDPOINTS).indexOf(uri) > -1) {
      return minWait(fetch(`http://localhost:5001${uri}`, options), DEMO_DELAY);
    }
    options.credentials = "include";
    prefix = `/${prefix}`;

    // /!\ TEMPORARY - LV-2129
    // -----------------------
    /* eslint-disable no-console */
    if (uri.endsWith("/challenge")) {
      console.log(`params: ${JSON.stringify(params)}`);
      console.log(`location: ${JSON.stringify(location)}`);
      console.log(`prefix: ${prefix}`);
      console.log(`API_BASE_URL: ${window.config.API_BASE_URL}`);
      console.log(`final url: ${window.config.API_BASE_URL + prefix + uri}`);
    }
    /* eslint-enable no-console */

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
