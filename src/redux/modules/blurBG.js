export const BLUR_BG = 'BLUR_BG';
export const UNBLUR_BG = 'UNBLUR_BG';

// Blur background action
export function blurBG() {
  return { type: BLUR_BG };
}

// Unblur background action
export function unblurBG() {
  return { type: UNBLUR_BG };
}

const initialState = { blurredBG: 0};

export default function reducer(state = initialState, action) {
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

