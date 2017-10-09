import { GET_OPERATION_START, OPERATION_CLOSE } from './operations';
import { OPEN_MODAL_ACCOUNT, SAVE_ACCOUNT_START, CLOSE_MODAL_ACCOUNT } from './account-creation';

export const BLUR_BG = 'BLUR_BG';
export const UNBLUR_BG = 'UNBLUR_BG';

const initialState = { blurredBG: 0 };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL_ACCOUNT:
    case GET_OPERATION_START:
      return { ...state, blurredBG: 1 };
    case CLOSE_MODAL_ACCOUNT:
    case OPERATION_CLOSE:
    case SAVE_ACCOUNT_START:
      return { ...state, blurredBG: 0 };
    default:
      return state;
  }
}

