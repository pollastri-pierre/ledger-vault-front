import { GET_OPERATION_START, OPERATION_CLOSE } from './operations';

export const BLUR_BG = 'BLUR_BG';
export const UNBLUR_BG = 'UNBLUR_BG';

const initialState = { blurredBG: 0 };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_OPERATION_START:
      return { ...state, blurredBG: 1 };
    case OPERATION_CLOSE:
      return { ...state, blurredBG: 0 };
    default:
      return state;
  }
}

