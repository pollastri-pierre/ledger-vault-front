import { GET_OPERATION_START, OPERATION_CLOSE } from "./operations";
import {
  OPEN_MODAL_ACCOUNT,
  SAVE_ACCOUNT_START,
  CLOSE_MODAL_ACCOUNT
} from "./account-creation";
import {
  OPEN_MODAL_OPERATION,
  SAVE_OPERATION_START,
  CLOSE_MODAL_OPERATION
} from "./operation-creation";
import {
  OPEN_ACCOUNT_APPROVE,
  CLOSE_ACCOUNT_APPROVE,
  ABORT_START,
  APPROVED
} from "./account-approve";

export const BLUR_BG = "BLUR_BG";
export const UNBLUR_BG = "UNBLUR_BG";

const initialState = { blurredBG: 0 };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL_ACCOUNT:
    case OPEN_MODAL_OPERATION:
    case GET_OPERATION_START:
    case OPEN_ACCOUNT_APPROVE:
      return { ...state, blurredBG: 1 };
    case CLOSE_MODAL_ACCOUNT:
    case CLOSE_MODAL_OPERATION:
    case OPERATION_CLOSE:
    case CLOSE_ACCOUNT_APPROVE:
    case SAVE_ACCOUNT_START:
    case SAVE_OPERATION_START:
    case ABORT_START:
    case APPROVED:
      return { ...state, blurredBG: 0 };
    default:
      return state;
  }
}
