// @flow
import type { Store } from "./dataStore";

type Notification = { title: string, content: string };

type Deserializer<T> = any => T;
type DeserializerMap<T> = { [_: string]: Deserializer<T> };

// A mutation maps to another verb on the API and means a modification of the data.
// it will allow us to define mutation response etc..
export default class Mutation<Input, Response> {
  props: Input;

  // define the URI to hit for the API. can also pass a template function
  uri: string;

  // HTTP verb
  method: string;

  // the schema of the expected HTTP response. defined using normalizr-style schema.
  responseSchema: Object | Array<Object>;

  deserialize: ?Deserializer<Response> | ?DeserializerMap<Response>;

  constructor(props: Input) {
    this.props = props;
  }

  showError = true;

  /*
   * Allow a mutation to define a body to send to server
   */
  getBody(): ?(Object | Array<Object>) {
    return null;
  }

  getResponseSchema() {
    return this.responseSchema;
  }

  /*
   * Allow a mutation to define the optimistic behavior
   */
  +optimisticUpdater: (_store: Store) => Store;
  // TODO implement optimistic updates.
  // aka being able to define how API calls should alter the local store
  // to update the UI before the call was successful.
  // challenges are:
  // - to express many possible usecases. e.g. a delete remove from one or more collections. a creation can also add in collections, and or can alter connected objects.
  // - to have rollback on error.
  // - to provide a way that a given data is optimistic so we can vary the rendering based on that.

  // FIXME technically the 2 following methods has nothing to do in this generic library model.
  // not sure how put it in project specific only

  // notification to trigger after data fetch
  +getSuccessNotification: (_response: Response) => ?Notification;

  // notification to trigger after data fetch failure
  +getErrorNotification: (_error: *) => ?Notification;
}
