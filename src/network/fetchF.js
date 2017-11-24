//@flow
let fetchF;

// path for video demo
if (false && process.env.NODE_ENV !== "development") {
  fetchF = fetch;
} else {
  const mockAPI = require("../data/mock-api").default;
  fetchF = (uri: string, options: Object): Promise<*> =>
    mockAPI(uri, options) || fetch(uri, options);
}

export default fetchF;
