import axios from 'axios';

export const START_FETCHING = 'START_FETCHING';
export const GOT_PROFILE = 'GOT_PROFILE';

export function startFetch() {
  return { type: START_FETCHING };
}

export function gotProfile(results) {
  return { type: GOT_PROFILE, results: results};
}

export const API_URL = 'https://randomuser.me/';

export function fetchProfile() {
  return function(dispatch) {
    dispatch(startFetch());
    axios.get(API_URL + '/api/')
      .then( (result) => {
        dispatch(gotProfile(result.data.results))
      });
  }
}

const initialState = {results: null, loading: false};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case START_FETCHING:
      return {...state, loading: true};
    case GOT_PROFILE:
      return { loading: false, results: action.results}
    default:
      return state;
  }
}

