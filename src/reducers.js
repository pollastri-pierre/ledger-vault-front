import { combineReducers } from 'redux';
import isEmpty from 'lodash/isEmpty';
import { BLUR_BG, UNBLUR_BG, SET_CURRENT_USER, SET_REROUTE, CHECK_AUTH } from './actions';

const initialState = {
  isAuthenticated: false,
  clearanceLevel: '',
  user: {},
};

function blurBG(state = { blurredBG: 0 }, action) {
  switch (action.type) {
    case BLUR_BG:
      return Object.assign({}, state, {
        blurredBG: state.blurredBG + 1,
      });

    case UNBLUR_BG:
      return Object.assign({}, state, {
        blurredBG: (state.blurredBG > 0) ? (state.blurredBG - 1) : state.blurredBG,
      });
    default:
      return state;
  }
}

function auth(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return Object.assign(
        {},
        state,
        {
          isAuthenticated: (!isEmpty(action.user) && !(action.user === 'undefined')),
          user: action.user,
          clearanceLevel: ((!isEmpty(action.user) && !(action.user === 'undefined')) ? 'all' : ''),
        },
      );
    default:
      return state;
  }
}

function setReroute(state = { reroute: '/' }, action) {
  switch (action.type) {
    case SET_REROUTE:
      return Object.assign({}, state, {
        reroute: action.reroute,
      });
    default:
      return state;
  }
}

const reducers = combineReducers({
  blurBG,
  auth,
  setReroute,
});

export default reducers;
