import { LOGOUT } from './auth';

export const OPEN_MODAL_ACCOUNT = 'account-creation/OPEN_MODAL_ACCOUNT';
export const CLOSE_MODAL_ACCOUNT = 'account-creation/CLOSE_MODAL_ACCOUNT';
export const CHANGE_TAB = 'account-creation/CHANGE_TAB';
export const SELECT_CURRENCY = 'account-creation/SELECT_CURRENCY';
export const CHANGE_ACCOUNT_NAME = 'account-creation/CHANGE_ACCOUNT_NAME';

export function openModalAccount() {
  return {
    type: OPEN_MODAL_ACCOUNT,
  };
}

export function closeModalAccount() {
  return {
    type: CLOSE_MODAL_ACCOUNT,
  };
}

export function changeTab(index) {
  return {
    type: CHANGE_TAB,
    index,
  };
}

export function selectCurrencyItem(currency) {
  return {
    type: SELECT_CURRENCY,
    currency,
  };
}

export function changeAccountName(name) {
  return {
    type: CHANGE_ACCOUNT_NAME,
    name,
  };
}

export function selectCurrency(currency) {
  return dispatch => {
    dispatch(selectCurrencyItem(currency));
    dispatch(changeTab(1));
  };
}


export const initialState = {
  modalOpened: false,
  currentTab: 0,
  currency: null,
  options: {
    name: '',
  },
  security: {
    members: [],
    approvals: null,
    timelock: null,
    ratelimite: null,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_ACCOUNT_NAME:
      return {
        ...state,
        options: {
          ...state.options,
          name: action.name,
        },
      };
    case OPEN_MODAL_ACCOUNT:
      return { ...state, modalOpened: true };
    case CLOSE_MODAL_ACCOUNT:
      return initialState;
    case CHANGE_TAB:
      return { ...state, currentTab: action.index };
    case SELECT_CURRENCY:
      return { ...state, currency: action.currency };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
