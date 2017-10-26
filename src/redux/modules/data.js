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

export function fetchData(action) {
  const q = query(action);
  return dispatch => {
    // dispatch({ type: 'DATA_FETCH_START', q });
    return q.then(data => {
      const result = normalize(data, apiSpec[action.id].responseSchema);
      dispatch({
        type: 'DATA_FETCHED',
        result
      });
      return result.result;
    });
  };
}

const reducers = {
  DATA_FETCHED: (store, { result }) => {
    let { entities } = store;
    return {
      entities: mergeEntities(entities, result.entities)
    };
  }
};

export default (state = initialState, action) =>
  action.type in reducers
    ? { ...state, ...reducers[action.type](state, action) }
    : state;
