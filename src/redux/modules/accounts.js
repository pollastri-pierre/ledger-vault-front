import { LOGOUT } from './auth';

import { data } from '../utils/accounts';

export const GET_ACCOUNTS_START = 'accounts/GET_ACCOUNTS_START';
export const GOT_ACCOUNTS = 'accounts/GOT_ACCOUNTS';
export const GOT_ACCOUNTS_FAIL = 'accounts/GOT_ACCOUNTS_FAIL';

export function getAccountStart() {
  return {
    type: GET_ACCOUNTS_START,
  };
}

export function gotAccounts(accounts) {
  return {
    type: GOT_ACCOUNTS,
    accounts,
  };
}

export function gotAccountsFail(status) {
  return {
    type: GOT_ACCOUNTS_FAIL,
    status,
  };
}

export function getAccounts() {
  return (dispatch) => {
    dispatch(getAccountStart());
    setTimeout(() => {
      dispatch(gotAccounts(data));
    }, 2000);
  };
}

const initialState = {
  isLoadingAccounts: false,
  accounts: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_ACCOUNTS_START:
      return { ...state, isLoadingAccounts: true };
    case GOT_ACCOUNTS:
      return { ...state, accounts: action.accounts, isLoadingAccounts: false };
    case GOT_ACCOUNTS_FAIL:
      return initialState;
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

