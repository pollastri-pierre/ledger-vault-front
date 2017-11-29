# restlay

The library handles client data synchronization with a REST server.

The name "restlay" comes from the library "relay" because takes many
inspirations from this GraphQL library.

## Roadmap

* DOCUMENTATION!
* pagination.

### future

* optimistic updates? aka local update implementation of mutations. complex
  topic.

### Tradeoffs

* there is currently a strong dependency on react-redux. `<RestlayProvider>`
  needs to be inside a redux store `<Provider>` and your store needs to use
  `redux-thunk` middleware and have a `data` that is `restlay/dataStore`.
