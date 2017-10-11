import {
  OPEN_MODAL_ACCOUNT,
  CLOSE_MODAL_ACCOUNT,
}
from './account-creation.js';

const initialState = null;

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL_ACCOUNT:
      return OPEN_MODAL_ACCOUNT;
    case CLOSE_MODAL_ACCOUNT:
      return null;
    default:
      return state;
  }
}

