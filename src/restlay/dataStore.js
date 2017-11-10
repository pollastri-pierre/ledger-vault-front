//@flow
import { normalize } from "normalizr";
import network from "../network"; // TODO this is an external dep. we need a way to inject the "network layer" (relay have a NetworkLayer concept, very interesting stuff)
import Mutation from "./Mutation";
import Query from "./Query";

export type Entities = {
  [_: string]: { [_: string]: Object }
};
type Result<R> = {
  result: R,
  time: number
};

export type Store = {
  entities: Entities,
  results: { [_: string]: Result<any> },
  pending: { [_: string]: Promise<any> },
  errors: { [_: string]: Error }
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

export const getQueryError = (store: Store, query: Query<*, *>): ?Error =>
  store.errors[query.getCacheKey()];

export const queryIsPending = (store: Store, query: Query<*, *>): boolean =>
  !!store.pending[query.getCacheKey()];

const initialState: Store = {
  entities: {},
  results: {},
  pending: {},
  errors: {}
};

function without(obj: { [_: string]: any }, key: string) {
  const o = { ...obj };
  delete o[key];
  return o;
}

function mergeEntities(prev: Entities, patch: Entities): Entities {
  const all = { ...patch, ...prev };
  const entities = {};
  for (let type in all) {
    entities[type] = { ...all[type], ...patch[type] };
  }
  return entities;
}

// FIXME might split into 2 functions, one for query, one for mutation
export const executeQueryOrMutation = (
  stateLense: (state: Object) => Store
) => <In, Out>(queryOrMutation: Query<In, Out> | Mutation<In, Out>) => (
  dispatch: Function,
  getState: () => *
): Promise<Out> => {
  const uri: string = queryOrMutation.uri;
  let cacheKey, method, body;
  if (queryOrMutation instanceof Query) {
    cacheKey = queryOrMutation.getCacheKey();
    const pendingPromise = stateLense(getState()).pending[cacheKey];
    if (pendingPromise) return pendingPromise;
    method = "GET";
  } else {
    method = queryOrMutation.method;
    body = queryOrMutation.getBody();
  }
  const promise = network(uri, method, body)
    .then(data => {
      const result = normalize(data, queryOrMutation.responseSchema || {});
      dispatch({
        type: "DATA_FETCHED",
        result,
        queryOrMutation,
        cacheKey
      });
      return result.result;
    })
    .catch(error => {
      dispatch({
        type: "DATA_FETCHED_FAIL",
        error,
        queryOrMutation,
        cacheKey
      });
      throw error;
    });
  dispatch({
    type: "DATA_FETCH",
    queryOrMutation,
    cacheKey,
    promise
  });
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
        },
        pending: without(store.pending, cacheKey),
        errors: without(store.errors, cacheKey)
      };
    }
  },
  DATA_FETCHED_FAIL: (store, { cacheKey, error }) =>
    cacheKey
      ? {
          ...store,
          pending: without(store.pending, cacheKey),
          errors: { ...store.errors, [cacheKey]: error }
        }
      : null,
  DATA_FETCH: (store, { cacheKey, promise }) =>
    cacheKey
      ? {
          ...store,
          pending: { ...store.pending, [cacheKey]: promise }
        }
      : null
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
