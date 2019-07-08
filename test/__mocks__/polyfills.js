// fetch() polyfill for making API calls.
require("whatwg-fetch");

// In tests, polyfill requestAnimationFrame since jsdom doesn't provide it yet.
// We don't polyfill it in the browser--this is user's responsibility.
if (process.env.NODE_ENV === "test") {
  require("raf").polyfill(global);
}

global.config = {
  API_BASE_URL: "http://localhost:5000",

  // TODO looks weird, but we don't want to trigger `checkToUpdate() => false`
  // because it trigger a window.history.push which is not supported by jsdom
  // and makes test fail
  APP_VERSION: undefined,
};
