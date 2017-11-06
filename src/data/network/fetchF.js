//@flow
let fetchF;
if (process.env.NODE_ENV !== "development") {
  fetchF = fetch;
} else {
  const mockAPI = require("../mock-api").default;
  fetchF = (uri: string, options: *): Promise<*> =>
    mockAPI(uri, options) || fetch(uri, options);
}

export default fetchF;
