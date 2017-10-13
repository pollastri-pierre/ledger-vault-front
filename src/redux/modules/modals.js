import {
  OPEN_MODAL_ACCOUNT,
  CLOSE_MODAL_ACCOUNT,
}
from './account-creation.js';

import {
  OPEN_ACCOUNT_APPROVE,
  CLOSE_ACCOUNT_APPROVE,
}
from './account-approve.js';

const initialState = null;

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_ACCOUNT_APPROVE:
    case OPEN_MODAL_ACCOUNT:
      return action.type;
    case CLOSE_ACCOUNT_APPROVE:
    case CLOSE_MODAL_ACCOUNT:
      return null;
    default:
      return state;
  }
}

