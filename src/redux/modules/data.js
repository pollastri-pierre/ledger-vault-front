//@flow
import { normalize } from "normalizr";
import mock from "../../data/mock-api";
import type { APISpec } from "../../data/api-spec";

const resolveURI = ({ uri }: APISpec, apiParams: ?Object): string =>
  typeof uri === "function" ? uri(apiParams || {}) : uri;

export const apiSpecCacheKey = (
  apiSpec: APISpec,
  apiParams: ?Object
): ?string => (apiSpec.cached ? resolveURI(apiSpec, apiParams) : null);

const initialState = {
  entities: {},
  caches: {} // by URI
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
  return mock(uri, spec.method, body)
    .then(data => {
      const result = normalize(data, spec.responseSchema);
      dispatch({
        type: "DATA_FETCHED",
        result,
        spec,
        cacheKey: apiSpecCacheKey(spec, apiParams)
      });
      return result.result;
    })
    .catch(error => {
      dispatch({ type: "DATA_FETCHED_FAIL", error, spec });
      throw error;
    });
};

const reducers = {
  DATA_FETCHED: (store, { result, cacheKey }) => ({
    entities: mergeEntities(store.entities, result.entities),
    caches: cacheKey
      ? { ...store.caches, [cacheKey]: result.result }
      : store.caches
  })
};

export default (state: * = initialState, action: Object) =>
  action.type in reducers
    ? { ...state, ...reducers[action.type](state, action) }
    : state;
