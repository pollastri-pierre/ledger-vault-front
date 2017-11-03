//@flow
import { normalize } from "normalizr";
import currencies from "../../currencies";
import mock from "../../data/mock-api";
import type { APISpec } from "../../data/api-spec";

const resolveURI = ({ uri }: APISpec, apiParams: ?Object): string =>
  typeof uri === "function" ? uri(apiParams || {}) : uri;

const query = (spec: APISpec, apiParams: ?Object, body: ?Object): Promise<*> =>
  mock(resolveURI(spec, apiParams), spec.method, body);

// This initialize the initial entities (things like currencies are already available)
const currenciesMap = {};
currencies.forEach(c => {
  currenciesMap[c.name] = c;
});
const initialState = {
  entities: { currencies: currenciesMap }
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
): Promise<*> =>
  query(spec, apiParams, body).then(data => {
    const result = normalize(data, spec.responseSchema);
    dispatch({
      type: "DATA_FETCHED",
      result,
      spec: spec
    });

    return result.result;
  });

const reducers = {
  DATA_FETCHED: (store, { result }) => ({
    entities: mergeEntities(store.entities, result.entities)
  })
};

export default (state: * = initialState, action: Object) =>
  action.type in reducers
    ? { ...state, ...reducers[action.type](state, action) }
    : state;
