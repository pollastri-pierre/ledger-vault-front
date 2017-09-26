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

export function gotReceiveAddress(idAccount, address) {
  return {
    type: GOT_RECEIVEADDRESS,
    address,
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
      const receive = {
        hash: 'fewfwfwefwekj8f23fkjklj123Hfedfsdf',
      };
      dispatch(gotReceiveAddress(idAccount, receive));
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
      const ctv = {
        amount: 55.45,
        countervalue: '18.989',
      };
      dispatch(gotCountervalue(idAccount, ctv));
    }, 1000);
  };
}

export function getBalanceStart() {
  return {
    type: GET_BALANCE_START,
  };
}

export function gotBalance(idAccount, balance) {
  return {
    type: GOT_BALANCE,
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
      const balance = {
        date: 'Today, 4pm',
        value: 'ETH 0.99923',
      };
      dispatch(gotBalance(idAccount, balance));
    }, 1400);
  };
}

const initialState = {
  idAccount: null,
  balance: null,
  countervalue: null,
  receiveAddress: null,
  isLoadingAddress: false,
  isLoadingBalance: false,
  isLoadingCounter: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_BALANCE_START: {
      return { ...state, isLoadingBalance: true };
    }
    case GET_RECEIVEADDRESS_START: {
      return { ...state, isLoadingAddress: true };
    }
    case GET_COUNTERVALUE_START: {
      return { ...state, isLoadingCounter: true };
    }
    case GOT_BALANCE: {
      return { ...state, isLoadingBalance: false, balance: action.balance };
    }
    case GOT_RECEIVEADDRESS: {
      return { ...state, isLoadingAddress: false, receiveAddress: action.address };
    }
    case GOT_COUNTERVALUE: {
      return { ...state, isLoadingCounter: false, countervalue: action.countervalue };
    }
    case GOT_BALANCE_FAIL: {
      return { ...state, balance: null, isLoadingBalance: false };
    }
    case GOT_RECEIVEADDRESS_FAIL: {
      return { ...state, receiveAddress: null, isLoadingAddress: false };
    }
    case GOT_COUNTERVALUE_FAIL: {
      return { ...state, countervalue: null, isLoadingCounter: false };
    }
    case LOCATION_CHANGE:
      return state;
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

