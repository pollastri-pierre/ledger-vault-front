//@flow
import APISpec from "./APISpec";

// A query maps to a GET on the api, it is idempotent to fetch and can be cached
export default class APIQuerySpec extends APISpec {
  // on a GET, the maximum amount of time (seconds) will be considered fresh and we don't need to refetch. we want the front app to not always refetch the data (NB maybe we could use HTTP Cache-Control but this is a simpler take on the problem)
  cacheMaxAge: number;
  // The response HTTP Code that will trigger the user to logout automatically
  logoutUserIfStatusCode: ?number;

  constructor(options: Object) {
    super({
      method: "GET",
      cacheMaxAge: 0,
      ...options
    });
  }
}
