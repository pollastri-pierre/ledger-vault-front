import { combineReducers } from 'redux';

import { BLUR_BG, UNBLUR_BG } from './actions';

function blurBG(state = { blurredBG: 0 }, action) {
  switch (action.type) {
    case BLUR_BG:
      if (state.blurredBG !== 1) {
        return Object.assign({}, state, { blurredBG: 1 });
      }
      return state;

    case UNBLUR_BG:
      if (state.blurredBG !== 0) {
        return Object.assign({}, state, { blurredBG: 0 });
      }
      return state;

    default:
      return state;
  }
}

const reducers = combineReducers({
  blurBG,
});

export default reducers;
