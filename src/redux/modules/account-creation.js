import _ from 'lodash';
import { LOGOUT } from './auth';

export const OPEN_MODAL_ACCOUNT = 'account-creation/OPEN_MODAL_ACCOUNT';
export const CLOSE_MODAL_ACCOUNT = 'account-creation/CLOSE_MODAL_ACCOUNT';
export const CHANGE_TAB = 'account-creation/CHANGE_TAB';
export const SELECT_CURRENCY = 'account-creation/SELECT_CURRENCY';
export const CHANGE_ACCOUNT_NAME = 'account-creation/CHANGE_ACCOUNT_NAME';
export const OPEN_MEMBERS = 'account-creation/OPEN_MEMBERS';
export const SWITCH_INTERN_MODAL = 'account-creation/SWITCH_INTERN_MODAL';
export const ADD_MEMBER = 'account-creation/ADD_MEMBER';
export const REMOVE_MEMBER = 'account-creation/REMOVE_MEMBER';
export const SET_APPROVALS = 'account-creation/SET_APPROVALS';
export const ENABLE_TIMELOCK = 'account-creation/ENABLE_TIMELOCK';
export const CHANGE_TIMELOCK = 'account-creation/CHANGE_TIMELOCK';
export const CHANGE_FREQUEMCY_TIMELOCK = 'account-creation/CHANGE_FREQUEMCY_TIMELOCK';
export const CHANGE_FREQUEMCY_RATELIMITER = 'account-creation/CHANGE_FREQUEMCY_RATELIMITER';

export function enableTimeLock() {
  return {
    type: ENABLE_TIMELOCK,
  };
}

export function changeFrequency(field, frequency) {
  if (field === 'rate-limiter') {
    return {
      type: CHANGE_FREQUEMCY_RATELIMITER,
      frequency,
    };
  }

  return {
    type: CHANGE_FREQUEMCY_TIMELOCK,
    frequency,
  };
}

export function changeTimeLock(number) {
  return {
    type: CHANGE_TIMELOCK,
    number,
  };
}

export function addMember(member) {
  return {
    type: ADD_MEMBER,
    member,
  };
}

export function setApprovals(number) {
  return {
    type: SET_APPROVALS,
    number,
  };
}

export function removeMember(member) {
  return {
    type: REMOVE_MEMBER,
    member,
  };
}

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

export function openMembers() {
  return {
    type: OPEN_MEMBERS,
  };
}

export function switchInternalModal(id) {
  return {
    type: SWITCH_INTERN_MODAL,
    id,
  };
}

export function selectCurrency(currency) {
  return (dispatch) => {
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
    approvals: 0,
    timelock: {
      enabled: false,
      duration: 0,
      frequency: 'hours',
    },
    rateLimiter: {
      enabled: true,
      rate: 0,
      frequency: 'hours',
    },
  },
  internModalId: 'main',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_MEMBER: {
      const _members = _.cloneDeep(state.security.members);
      let _approvals = _.cloneDeep(state.security.approvals);
      const find = _.find(state.security.members, { id: action.member.id});

      if (find) {
        _.remove(_members, { id: action.member.id });
      } else {
        _members.push(action.member);
      }

      return {
        ...state, security: { ...state.security, members: _members },
      };
    }
    case CHANGE_ACCOUNT_NAME:
      return {
        ...state,
        options: {
          ...state.options,
          name: action.name,
        },
      };
    case SWITCH_INTERN_MODAL:
      return { ...state, internModalId: action.id };
    case SET_APPROVALS: {
      const isNumber = /^[0-9\b]+$/;

      if (action.number === '' || isNumber.test(action.number)) {
        return {
          ...state,
          security: {
            ...state.security,
            approvals: parseInt(action.number, 10),
          },
        };
      }

      return state;
    }
    case OPEN_MODAL_ACCOUNT:
      return { ...state, modalOpened: true };
    case CLOSE_MODAL_ACCOUNT:
      return initialState;
    case CHANGE_TAB:
      return { ...state, currentTab: action.index };
    case SELECT_CURRENCY:
      return { ...state, currency: action.currency };
    case ENABLE_TIMELOCK:
      return {
        ...state,
        security: {
          ...state.security,
          timelock: {
            ...state.security.timelock,
            enabled: !state.security.timelock.enabled,
          },
        },
      };
    case CHANGE_TIMELOCK: {
      const isNumber = /^[0-9\b]+$/;

      if (action.number === '' || isNumber.test(action.number)) {
        return {
          ...state,
          security: {
            ...state.security,
            timelock: {
              ...state.security.timelock,
              duration: action.number,
            },
          },
        };
      }

      return state;
    }
    case CHANGE_FREQUEMCY_TIMELOCK: {
      return {
        ...state,
        security: {
          ...state.security,
          timelock: {
            ...state.security.timelock,
            frequency: action.frequency,
          },
        },
      };
    }
    case CHANGE_FREQUEMCY_RATELIMITER: {
      return {
        ...state,
        security: {
          ...state.security,
          rateLimiter: {
            ...state.security.rateLimiter,
            frequency: action.frequency,
          },
        },
      };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
