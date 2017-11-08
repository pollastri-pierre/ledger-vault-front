//@flow
import { normalize } from "normalizr";
import network from "../data/network"; // TODO this is an external dep. we need a way to inject the "network layer" (relay have a NetworkLayer concept, very interesting stuff)
import type APISpec from "./APISpec";
import type APIQuerySpec from "./APIQuerySpec";

type Entities = {
  [_: string]: { [_: string]: Object }
};
type Result = {
  result: Object | Array<Object>,
  time: number
};

export type Store = {
  entities: Entities,
  results: { [_: string]: Result },
  pending: { [_: string]: Promise<*> },
  errors: { [_: string]: Error }
};

const resolveURI = ({ uri }: APISpec, apiParams: ?Object): string =>
  typeof uri === "function" ? uri(apiParams || {}) : uri;

const apiSpecCacheKey = (apiSpec: APISpec, apiParams: ?Object): string =>
  apiSpec.method + "_" + resolveURI(apiSpec, apiParams);

export const getResultCache = (
  store: Store,
  apiSpec: APISpec,
  apiParams: ?Object
): ?Result => store.results[apiSpecCacheKey(apiSpec, apiParams)];

export const cacheIsFresh = (
  store: Store,
  apiSpec: APIQuerySpec,
  apiParams: ?Object
): boolean => {
  const cache = getResultCache(store, apiSpec, apiParams);
  if (!cache) return false;
  return Date.now() < cache.time + 1000 * apiSpec.cacheMaxAge;
};

export const getResultError = (
  store: Store,
  apiSpec: APISpec,
  apiParams: ?Object
): ?Error => store.errors[apiSpecCacheKey(apiSpec, apiParams)];

export const isPending = (
  store: Store,
  apiSpec: APISpec,
  apiParams: ?Object
): boolean => !!store.pending[apiSpecCacheKey(apiSpec, apiParams)];

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

export const fetchDataAction = (stateLense: (state: Object) => Store) => (
  spec: APISpec,
  apiParams: ?Object,
  body: ?Object
) => (dispatch: Function, getState: () => *): Promise<*> => {
  const uri = resolveURI(spec, apiParams);
  const cacheKey = apiSpecCacheKey(spec, apiParams);
  if (spec.method === "GET") {
    // we need to not do a query if one is already in progress at this level because we don't to have tons of dispatch() happening
    const pendingPromise = stateLense(getState()).pending[cacheKey];
    if (pendingPromise) return pendingPromise;
  }
  const promise = network(uri, spec.method, body)
    .then(data => {
      const result = normalize(data, spec.responseSchema);
      dispatch({
        type: "DATA_FETCHED",
        result,
        spec,
        cacheKey
      });
      return result.result;
    })
    .catch(error => {
      dispatch({ type: "DATA_FETCHED_FAIL", error, spec, cacheKey });
      throw error;
    });
  dispatch({
    type: "DATA_FETCH",
    spec,
    cacheKey,
    promise
  });
  return promise;
};

const reducers = {
  DATA_FETCHED: (store, { result, cacheKey }) => ({
    entities: mergeEntities(store.entities, result.entities),
    results: {
      ...store.results,
      [cacheKey]: { result: result.result, time: Date.now() }
    },
    pending: without(store.pending, cacheKey),
    errors: without(store.errors, cacheKey)
  }),
  DATA_FETCHED_FAIL: (store, { cacheKey, error }) => ({
    ...store,
    pending: without(store.pending, cacheKey),
    errors: { ...store.errors, [cacheKey]: error }
  }),
  DATA_FETCH: (store, { cacheKey, promise }) => ({
    ...store,
    pending: { ...store.pending, [cacheKey]: promise }
  })
};

export const reducer = (state: * = initialState, action: Object) =>
  action.type in reducers
    ? { ...state, ...reducers[action.type](state, action) }
    : state;
