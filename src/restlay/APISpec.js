//@flow

// TODO: we need to have the response type <R> parametric type so we can do interesting things with it in connectData
// in the future we might actually need to define class Foo extends APIQuerySpec so they can hold the types.. this is I believe why Relay did that as well
// the nice thing about it is that uri would become something you can handle with such class parameters.. we'll see later

// this is the common part of both APIQuerySpec and APIMutationSpec
export default class APISpec {
  // define the URI to hit for the API. can also pass a template function
  uri: string | ((_: Object) => string);
  // HTTP verb
  method: string;
  // the schema of the expected HTTP response. defined using normalizr-style schema.
  responseSchema: Object | Array<Object>;

  constructor(options: { uri: *, method: * }) {
    Object.assign(this, {
      responseSchema: {},
      ...options
    });
  }
}
