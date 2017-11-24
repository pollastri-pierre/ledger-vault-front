//@flow
import { normalize } from "normalizr";
import Mutation from "./Mutation";
import Query from "./Query";
import { merge } from "./ImmutableUtils";
import isEqual from "lodash/isEqual";

export type Entities = {
  [_: string]: { [_: string]: Object }
};
type Result<R> = {
  result: R,
  time: number
};

export type NetworkF = <T>(
  uri: string,
  method: string,
  body: ?(Object | Array<Object>)
) => Promise<T>;

type DispatchF = (action: Object) => void;

type QueryDispatchF = <In, Out>(
  queryOrMutation: Query<In, Out> | Mutation<In, Out>
) => (dispatch: DispatchF) => Promise<Out>;

type ExecuteQueryOrMutation = (n: NetworkF) => QueryDispatchF;

export type Store = {
  entities: Entities,
  results: { [_: string]: Result<any> }
};

export function getQueryCacheResult<I, R>(
  store: Store,
  query: Query<I, R>
): ?Result<R> {
  return store.results[query.getCacheKey()];
}

export function queryCacheIsFresh(store: Store, query: Query<*, *>): boolean {
  const cache = getQueryCacheResult(store, query);
  if (!cache) return false;
  return Date.now() < cache.time + 1000 * query.cacheMaxAge;
}

const initialState: Store = {
  entities: {},
  results: {}
};

// NB we do not preserve the entities object immutable, but only for the object entity itself
function mergeEntities(prev: Entities, patch: Entities): Entities {
  const all = { ...patch, ...prev }; // potentially there are new collections
  const entities = {};
  for (let type in all) {
    const patchColl = patch[type];
    const oldColl = all[type];
    entities[type] = merge(oldColl, patchColl, isEqual);
  }
  return entities;
}

// FIXME this cache probably should live in the RestlayProvider too
// because we want to clear it & don't share it across impls, etc..
const globalPromiseCache: { [_: string]: Promise<any> } = {};

export const executeQueryOrMutation: ExecuteQueryOrMutation =
  // network is dynamically provided so the library can be mocked (e.g. for tests)
  network => queryOrMutation => dispatch => {
    const uri = queryOrMutation.uri;
    let cacheKey, method, body;
    if (queryOrMutation instanceof Query) {
      cacheKey = queryOrMutation.getCacheKey();
      const pendingPromise = globalPromiseCache[cacheKey];
      if (pendingPromise) return pendingPromise;
      method = "GET";
    } else {
      method = queryOrMutation.method;
      body = queryOrMutation.getBody();
    }
    const promise = network(uri, method, body)
      .then(data => {
        const result = normalize(data, queryOrMutation.responseSchema || {});
        if (cacheKey) delete globalPromiseCache[cacheKey];
        dispatch({
          type: "DATA_FETCHED",
          result,
          queryOrMutation,
          cacheKey
        });
        return result.result;
      })
      .catch(error => {
        if (cacheKey) delete globalPromiseCache[cacheKey];
        dispatch({
          type: "DATA_FETCHED_FAIL",
          error,
          queryOrMutation,
          cacheKey
        });
        throw error;
      });

    if (cacheKey) globalPromiseCache[cacheKey] = promise;
    return promise;
  };

const reducers = {
  DATA_FETCHED: (store, { result, cacheKey }) => {
    const entities = mergeEntities(store.entities, result.entities);
    if (!cacheKey) {
      return { ...store, entities };
    } else {
      return {
        entities,
        results: {
          ...store.results,
          [cacheKey]: { result: result.result, time: Date.now() }
        }
      };
    }
  }
};

export const reducer = (state: * = initialState, action: Object) => {
  if (action.type in reducers) {
    const patch = reducers[action.type](state, action);
    if (patch) {
      return { ...state, ...patch };
    }
  }
  return state;
};
