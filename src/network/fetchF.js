// @flow
import mockAPI from "data/mock-api";
import { ENDPOINTS } from "device/VaultDeviceHTTP";

let fetchF; // eslint-disable-line import/no-mutable-exports

if (process.env.NODE_ENV === "test") {
  fetchF = mockAPI;
} else {
  fetchF = (uri: string, options: Object): Promise<*> => {
    let prefix = location.pathname.split("/")[1];
    // endpoints for mock device API
    if (Object.values(ENDPOINTS).indexOf(uri) > -1) {
      return fetch(`http://localhost:5001${uri}`, options);
    }
    prefix = `/${prefix}`;
    return fetch(window.config.API_BASE_URL + prefix + uri, options);
  };
}
export default fetchF;
