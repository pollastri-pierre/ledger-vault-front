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
  entities: { currencies: currenciesMap },
  loadingAPIs: {},
  requestResults: {}
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
    console.log('yo');
    dispatch({ type: 'DATA_FETCH_START', requestId: action.requestId, q });
    return q
      .catch(e => {
        console.error('API failed', e); // TODO handle error properly
      })
      .then(data => {
        console.log('API got ', data);
        const result = normalize(data, apiSpec[action.id].responseSchema);
        dispatch({
          type: 'DATA_FETCHED',
          result,
          requestId: action.requestId
        });
      });
  };
}

const reducers = {
  DATA_FETCH_START: (
    { loadingAPIs, entities },
    { requestId, queryHash, q }
  ) => {
    return {
      entities,
      loadingAPIs: {
        ...loadingAPIs,
        [requestId]: q
      }
    };
  },
  DATA_FETCHED: (store, { result, requestId }) => {
    let { loadingAPIs, entities, requestResults } = store;
    loadingAPIs = { ...loadingAPIs };
    delete loadingAPIs[requestId];
    console.log('fetched', result);
    return {
      entities: mergeEntities(entities, result.entities),
      loadingAPIs,
      requestResults: { ...requestResults, [requestId]: result.result }
    };
  }
};

export default (state = initialState, action) =>
  action.type in reducers
    ? { ...state, ...reducers[action.type](state, action) }
    : state;
