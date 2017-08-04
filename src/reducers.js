import { combineReducers } from 'redux';
import isEmpty from 'lodash/isEmpty';
import { BLUR_BG, UNBLUR_BG, SET_CURRENT_USER } from './actions';

const initialState = {
  isAuthenticated: false,
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
      console.log('test auth', action);
      return Object.assign(
        {},
        state,
        {
          isAuthenticated: (!isEmpty(action.user) && !(action.user === 'undefined')),
          user: action.user,
        },
      );
    default:
      return state;
  }
}

const reducers = combineReducers({
  blurBG,
  auth,
});

export default reducers;
