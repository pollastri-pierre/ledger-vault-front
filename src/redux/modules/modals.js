import {
  OPEN_MODAL_ACCOUNT,
  CLOSE_MODAL_ACCOUNT,
} from './account-creation';

import {
  OPEN_MODAL_OPERATION,
  CLOSE_MODAL_OPERATION,
} from './operation-creation';

const initialState = null;

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL_ACCOUNT:
      return OPEN_MODAL_ACCOUNT;

    case OPEN_MODAL_OPERATION:
      return OPEN_MODAL_OPERATION;

    case CLOSE_MODAL_ACCOUNT:
    case CLOSE_MODAL_OPERATION:
      return null;
    default:
      return state;
  }
}

