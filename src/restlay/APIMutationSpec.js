//@flow
import APISpec from "./APISpec";

// TODO implement optimistic updates.
// aka being able to define how API calls should alter the local store
// to update the UI before the call was successful.
// challenges are:
// - to express many possible usecases. e.g. a delete remove from one or more collections. a creation can also add in collections, and or can alter connected objects.
// - to have rollback on error.
// - to provide a way that a given data is optimistic so we can vary the rendering based on that.

// A mutation maps to another verb on the API and means a modification of the data.
// it will allow us to define mutation response etc..
export default class APIQuerySpec extends APISpec {
  // notification to trigger after data fetch
  notif: ?{
    title: string,
    content: string
  };
  constructor(options: Object) {
    super({
      ...options
    });
  }
}
