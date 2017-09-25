import { LOGOUT } from './auth';
import { LOCATION_CHANGE } from 'react-router-redux';

export const GET_BALANCE_START = 'accounts/GET_BALANCE_START';
export const GOT_BALANCE = 'accounts/GOT_BALANCE';
export const GOT_BALANCE_FAIL = 'accounts/GOT_BALANCE_FAIL';
export const GET_COUNTERVALUE_START = 'accounts/GET_COUNTERVALUE_START';
export const GOT_COUNTERVALUE = 'accounts/GOT_COUNTERVALUE';
export const GOT_COUNTERVALUE_FAIL = 'accounts/GOT_COUNTERVALUE_FAIL';
export const GET_RECEIVEADDRESS_START = 'accounts/GET_RECEIVEADDRESS_START';
export const GOT_RECEIVEADDRESS = 'accounts/GOT_RECEIVEADDRESS';
export const GOT_RECEIVEADDRESS_FAIL = 'accounts/GOT_RECEIVEADDRESS_FAIL';

export function getReceiveAddressStart() {
  return {
    type: GET_RECEIVEADDRESS_START,
  };
}

export function gotReceiveAddress(idAccount, countervalue) {
  return {
    type: GOT_RECEIVEADDRESS,
    countervalue,
    idAccount,
  };
}

export function gotReceiveAddressFail(idAccount, status) {
  return {
    type: GOT_RECEIVEADDRESS_FAIL,
    idAccount,
    status,
  };
}

export function getReceiveAddress(idAccount) {
  return (dispatch) => {
    dispatch(getReceiveAddressStart());
    setTimeout(() => {
      const ctv = 100;
      dispatch(gotReceiveAddress(ctv, idAccount));
    }, 2000);
  };
}

export function getCountervalueStart() {
  return {
    type: GET_COUNTERVALUE_START,
  };
}

export function gotCountervalue(idAccount, countervalue) {
  return {
    type: GOT_COUNTERVALUE,
    countervalue,
    idAccount,
  };
}

export function gotCountervalueFail(idAccount, status) {
  return {
    type: GOT_COUNTERVALUE_FAIL,
    idAccount,
    status,
  };
}

export function getCountervalue(idAccount) {
  return (dispatch) => {
    dispatch(getCountervalueStart());
    setTimeout(() => {
      const ctv = 100;
      dispatch(gotCountervalue(ctv, idAccount));
    }, 2000);
  };
}

export function getBalanceStart() {
  return {
    type: GET_BALANCE_START,
  };
}

export function gotBalance(idAccount, balance) {
  return {
    type: GET_BALANCE_START,
    balance,
    idAccount,
  };
}

export function gotBalanceFail(idAccount, status) {
  return {
    type: GOT_BALANCE_FAIL,
    idAccount,
    status,
  };
}

export function getBalance(idAccount) {
  return (dispatch) => {
    dispatch(getBalanceStart());
    setTimeout(() => {
      const balance = 100;
      dispatch(gotBalance(balance, idAccount));
    }, 2000);
  };
}

const initialState = {
  balance: null,
  countervalue: null,
  receiveAddress: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_BALANCE_START: {
      return { ...state, isLoadingAccounts: true };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

