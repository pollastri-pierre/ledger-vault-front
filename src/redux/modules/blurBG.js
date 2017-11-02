import {
  OPEN_MODAL_OPERATION_DETAILS,
  OPERATION_CLOSE_DETAILS
} from "./operations";
import {
  OPEN_MODAL_ACCOUNT,
  SAVE_ACCOUNT_START,
  CLOSE_MODAL_ACCOUNT
} from "./account-creation";
// import { OPEN_MODAL_OPERATION, OPERATION_CLOSE } from "./operation-creation";
import { OPEN_ENTITY_APPROVE, CLOSE_APPROVE } from "./entity-approve";

export const BLUR_BG = "BLUR_BG";
export const UNBLUR_BG = "UNBLUR_BG";

const initialState = { blurredBG: 0 };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL_ACCOUNT:
    case OPEN_MODAL_OPERATION_DETAILS:
    case OPEN_MODAL_OPERATION_DETAILS:
    case OPEN_ENTITY_APPROVE:
      return { ...state, blurredBG: 1 };
    case CLOSE_MODAL_ACCOUNT:
    case OPERATION_CLOSE_DETAILS:
    case CLOSE_APPROVE:
    case SAVE_ACCOUNT_START:
      return { ...state, blurredBG: 0 };
    default:
      return state;
  }
}
