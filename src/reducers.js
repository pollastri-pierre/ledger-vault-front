import { combineReducers } from 'redux';

import { BLUR_BG, UNBLUR_BG } from './actions';

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

const reducers = combineReducers({
  blurBG,
});

export default reducers;
