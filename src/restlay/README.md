# restlay

This folder will eventually be the generic part of our connectData lib so we
might reuse it for other projects.

I suggest such lib would be called "restlay" because most ideas are kinda
inspired from "relay" but for rest

Eventually, we should bring in the connectData / data store, anything that is
generic... i'm not even sure if this should continue dep on redux on the long
term and if this should expose ways to "hook" to specific api calls.

## TODO

* DOCUMENTATION!
* TESTS! we need heavy tests so we can test different scenario, and if
  everything works as expected.
* reloading / optimisticRendering (from cache) => this needs to be more thought,
  tested and polished.
* "NetworkLayer" separation: the network should be injected in an interesting
  way so this is mockable for test / mock data. currently we have a strong
  import dependencies on ../network.
* pagination. This is a tricky problem obviously, I like how Relay solved it
  with GraphQL but they have strong conventions over the API. We can diverge
  from that of course. There are interesting ideas like there is this "variable"
  concept we could put on a connectData and we just have to setVariables to
  increment the page count... But this is still not so trivial.
