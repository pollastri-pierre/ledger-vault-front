//@flow
import { normalize } from "normalizr";
import network from "../../data/network";
import type { APISpec } from "../../data/api-spec";

const resolveURI = ({ uri }: APISpec, apiParams: ?Object): string =>
  typeof uri === "function" ? uri(apiParams || {}) : uri;

export const apiSpecCacheKey = (
  apiSpec: APISpec,
  apiParams: ?Object
): ?string => apiSpec.method + "_" + resolveURI(apiSpec, apiParams);

const initialState = {
  entities: {},
  caches: {},
  pending: {}
};

function mergeEntities(prev, patch) {
  const all = { ...patch, ...prev };
  const entities = {};
  for (let type in all) {
    entities[type] = { ...all[type], ...patch[type] };
  }
  return entities;
}

export const fetchData = (spec: APISpec, apiParams: ?Object, body: ?Object) => (
  dispatch: Function
): Promise<*> => {
  const uri = resolveURI(spec, apiParams);
  const cacheKey = apiSpecCacheKey(spec, apiParams);
  dispatch({
    type: "DATA_FETCH",
    spec,
    cacheKey
  });
  return network(uri, spec.method, body)
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
};

const reducers = {
  DATA_FETCHED: (store, { result, cacheKey }) => ({
    entities: mergeEntities(store.entities, result.entities),
    caches: { ...store.caches, [cacheKey]: result.result },
    pending: { ...store.pending, [cacheKey]: false }
  }),
  DATA_FETCHED_FAIL: (store, { cacheKey }) => ({
    ...store,
    pending: { ...store.pending, [cacheKey]: false }
  }),
  DATA_FETCH: (store, { cacheKey }) => ({
    ...store,
    pending: { ...store.pending, [cacheKey]: true }
  })
};

export default (state: * = initialState, action: Object) =>
  action.type in reducers
    ? { ...state, ...reducers[action.type](state, action) }
    : state;
