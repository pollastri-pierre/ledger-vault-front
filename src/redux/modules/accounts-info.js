import _ from 'lodash';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOGOUT } from './auth';
import { getFakeList } from '../utils/operation';

export const GET_BALANCE_START = 'accounts-info/GET_BALANCE_START';
export const GOT_BALANCE = 'accounts-info/GOT_BALANCE';
export const GOT_BALANCE_FAIL = 'accounts-info/GOT_BALANCE_FAIL';
export const GET_COUNTERVALUE_START = 'accounts-info/GET_COUNTERVALUE_START';
export const GOT_COUNTERVALUE = 'accounts-info/GOT_COUNTERVALUE';
export const GOT_COUNTERVALUE_FAIL = 'accounts-info/GOT_COUNTERVALUE_FAIL';
export const GET_RECEIVEADDRESS_START = 'accounts-info/GET_RECEIVEADDRESS_START';
export const GOT_RECEIVEADDRESS = 'accounts-info/GOT_RECEIVEADDRESS';
export const GOT_RECEIVEADDRESS_FAIL = 'accounts-info/GOT_RECEIVEADDRESS_FAIL';

export const GET_OPERATIONS_START = 'accounts-info/GET_OPERATIONS_START';
export const GOT_OPERATIONS = 'accounts-info/GOT_OPERATIONS';
export const GOT_OPERATIONS_FAIL = 'accounts-info/GOT_OPERTAIONS_FAIL';

const promises = [];

const clearPromise = promise => {
  clearTimeout(promise);
};

export function getOperationsStart(idAccount) {
  return {
    type: GET_OPERATIONS_START,
    idAccount,
  };
}

export function gotOperations(operations) {
  return {
    type: GOT_OPERATIONS,
    operations,
  };
}

export function gotOperationsFail() {
  return {
    type: GOT_OPERATIONS_FAIL,
  };
}


export function getOperations() {
  return (dispatch) => {
    dispatch(getOperationsStart());

    const operations = getFakeList();
    console.log(operations);

    promises[promises.length] = setTimeout(() => {
      dispatch(gotOperations(operations));
    }, 1300);
  };
}

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
    promises[promises.length] = setTimeout(() => {
      const receive = {
        hash: 'fewfwfwefwekj8f23fkjklj123Hfedfsdf',
      };
      dispatch(gotReceiveAddress(idAccount, receive));
    }, 800);
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
    promises[promises.length] = setTimeout(() => {
      const ctv = {
        amount: 55.45,
        countervalue: '18.989',
      };
      dispatch(gotCountervalue(idAccount, ctv));
    }, 1000);
  };
}

export function getBalanceStart(idAccount) {
  return {
    type: GET_BALANCE_START,
    idAccount,
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
    dispatch(getBalanceStart(idAccount));
    promises[promises.length] = setTimeout(() => {
      const balance = {
        date: 'Today, 4pm',
        value: 'ETH 0.99923',
      };
      dispatch(gotBalance(idAccount, balance));
    }, 1400);
  };
}

export const initialState = {
  idAccount: null,
  balance: null,
  countervalue: null,
  receiveAddress: null,
  isLoadingOperations: false,
  isLoadingNextOperations: false,
  isLoadingAddress: false,
  isLoadingBalance: false,
  isLoadingCounter: false,
  operations: null,
  cursor: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_BALANCE_START: {
      return { ...state, isLoadingBalance: true, idAccount: action.idAccount };
    }
    case GET_RECEIVEADDRESS_START: {
      return { ...state, isLoadingAddress: true };
    }
    case GET_COUNTERVALUE_START: {
      return { ...state, isLoadingCounter: true };
    }
    case GET_OPERATIONS_START: {
      if (action.next) {
        return { ...state, isLoadingNextOperations: true };
      }

      return { ...state, isLoadingOperations: true };
    }
    case GOT_OPERATIONS: {
      if (_.isNull(state.operations)) {
        return {
          ...state,
          isLoadingNextOperations: false,
          isLoadingOperations: false,
          cursor: action.cursor,
          operations: action.operations,
        };
      }

      return {
        ...state,
        isLoadingNextOperations: false,
        isLoadingOperations: false,
        cursor: action.cursor,
        operations: [...state.operations, ...action.operations],
      };
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
    case LOCATION_CHANGE: {
      const pathname = action.payload.pathname;
      const split = pathname.split('/account/');
      console.log(split);


      if (split.length === 1 || (split[1] && split[1] !== state.idAccount)) {
        _.each(promises, promise => {
          clearPromise(promise);
        });
        return initialState;
      }


      return state;
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

