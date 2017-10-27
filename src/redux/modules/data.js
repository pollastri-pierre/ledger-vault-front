import { normalize, denormalize } from 'normalizr';
import currencies from '../../currencies';
import query from '../../data/query';
import apiSpec from '../../data/api-spec';

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

export const fetchData = (spec, apiParams, body) => dispatch =>
  query(spec, apiParams, body).then(data => {
    const result = normalize(data, spec.responseSchema);
    dispatch({
      type: 'DATA_FETCHED',
      result
    });
    return result.result;
  });

const reducers = {
  DATA_FETCHED: (store, { result }) => ({
    entities: mergeEntities(store.entities, result.entities)
  })
};

export default (state = initialState, action) =>
  action.type in reducers
    ? { ...state, ...reducers[action.type](state, action) }
    : state;
