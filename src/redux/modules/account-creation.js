import _ from "lodash";
import { LOGOUT } from "./auth";

export const CHANGE_TAB = "account-creation/CHANGE_TAB";
export const SELECT_CURRENCY = "account-creation/SELECT_CURRENCY";
export const CHANGE_ACCOUNT_NAME = "account-creation/CHANGE_ACCOUNT_NAME";
export const SWITCH_INTERN_MODAL = "account-creation/SWITCH_INTERN_MODAL";
export const ADD_MEMBER = "account-creation/ADD_MEMBER";
export const REMOVE_MEMBER = "account-creation/REMOVE_MEMBER";
export const SET_APPROVALS = "account-creation/SET_APPROVALS";
export const ENABLE_TIMELOCK = "account-creation/ENABLE_TIMELOCK";
export const CHANGE_TIMELOCK = "account-creation/CHANGE_TIMELOCK";
export const CHANGE_FREQUEMCY_TIMELOCK =
  "account-creation/CHANGE_FREQUEMCY_TIMELOCK";
export const CHANGE_FREQUEMCY_RATELIMITER =
  "account-creation/CHANGE_FREQUEMCY_RATELIMITER";
export const OPEN_POPBUBBLE = "account-creation/OPEN_POPBUBBLE";
export const ENABLE_RATELIMITER = "account-creation/ENABLE_RATELIMITER";
export const CHANGE_RATELIMITER = "account-creation/CHANGE_RATELIMITER";
export const CLEAR_STATE = "account-creation/CLEAR_STATE";

export const SAVE_ACCOUNT_START = "account-creation/SAVE_ACCOUNT_START";
export const SAVED_ACCOUNT = "account-creation/SAVED_ACCOUNT";
export const SAVED_ACCOUNT_FAIL = "account-creation/SAVED_ACCOUNT_FAIL";

export function openPopBubble(anchor) {
  return {
    type: OPEN_POPBUBBLE,
    anchor
  };
}

export function enableTimeLock() {
  return {
    type: ENABLE_TIMELOCK
  };
}

export function enableRatelimiter() {
  return {
    type: ENABLE_RATELIMITER
  };
}

export function changeFrequency(field, frequency) {
  if (field === "rate-limiter") {
    return {
      type: CHANGE_FREQUEMCY_RATELIMITER,
      frequency
    };
  }

  return {
    type: CHANGE_FREQUEMCY_TIMELOCK,
    frequency
  };
}

export function changeTimeLock(number) {
  return {
    type: CHANGE_TIMELOCK,
    number
  };
}

export function changeRatelimiter(number) {
  return {
    type: CHANGE_RATELIMITER,
    number
  };
}

export function addMember(member) {
  return {
    type: ADD_MEMBER,
    member
  };
}

export function setApprovals(number) {
  return {
    type: SET_APPROVALS,
    number
  };
}

export function removeMember(member) {
  return {
    type: REMOVE_MEMBER,
    member
  };
}

export function clearState() {
  return {
    type: CLEAR_STATE
  };
}

export function changeTab(index) {
  return {
    type: CHANGE_TAB,
    index
  };
}

export function selectCurrencyItem(currency) {
  return {
    type: SELECT_CURRENCY,
    currency
  };
}

export function changeAccountName(name) {
  return {
    type: CHANGE_ACCOUNT_NAME,
    name
  };
}

export function switchInternalModal(id) {
  return {
    type: SWITCH_INTERN_MODAL,
    id
  };
}

export function selectCurrency(currency) {
  return dispatch => {
    dispatch(selectCurrencyItem(currency));
    dispatch(changeTab(1));
  };
}

export const initialState = {
  currentTab: 0,
  currency: null,
  name: "",
  approvers: [],
  quorum: "0",
  time_lock: {
    enabled: false,
    value: 0,
    frequency: "minuts"
  },
  rate_limiter: {
    enabled: false,
    value: 0,
    frequency: "day"
  },
  interModalId: "main",
  popBubble: false,
  popAnchor: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_STATE:
      return initialState;
    case ADD_MEMBER: {
      const cMembers = _.cloneDeep(state.approvers);
      const index = cMembers.indexOf(action.member);

      if (index > -1) {
        cMembers.splice(index, 1);
      } else {
        cMembers.push(action.member);
      }

      return {
        ...state,
        approvers: cMembers
      };
    }
    case CHANGE_ACCOUNT_NAME:
      return {
        ...state,
        name: action.name
      };
    case SWITCH_INTERN_MODAL:
      return { ...state, internModalId: action.id };
    case SET_APPROVALS: {
      const isNumber = /^[0-9\b]+$/;

      if (action.number === "" || isNumber.test(action.number)) {
        return {
          ...state,
          quorum: action.number
        };
      }

      return state;
    }
    case CHANGE_TAB:
      return { ...state, currentTab: action.index };
    case SELECT_CURRENCY:
      return { ...state, currency: action.currency };
    case ENABLE_TIMELOCK:
      return {
        ...state,
        time_lock: {
          ...state.time_lock,
          enabled: !state.time_lock.enabled
        }
      };
    case ENABLE_RATELIMITER:
      return {
        ...state,
        rate_limiter: {
          ...state.rate_limiter,
          enabled: !state.rate_limiter.enabled
        }
      };
    case CHANGE_TIMELOCK: {
      const isNumber = /^[0-9\b]+$/;

      if (action.number === "" || isNumber.test(action.number)) {
        return {
          ...state,
          time_lock: {
            ...state.time_lock,
            value: action.number
          }
        };
      }

      return state;
    }
    case CHANGE_RATELIMITER: {
      const isNumber = /^[0-9\b]+$/;

      if (action.number === "" || isNumber.test(action.number)) {
        return {
          ...state,
          rate_limiter: {
            ...state.rate_limiter,
            value: action.number
          }
        };
      }

      return state;
    }
    case CHANGE_FREQUEMCY_TIMELOCK: {
      return {
        ...state,
        time_lock: {
          ...state.time_lock,
          frequency: action.frequency
        },
        popBubble: false
      };
    }
    case CHANGE_FREQUEMCY_RATELIMITER: {
      return {
        ...state,
        rate_limiter: {
          ...state.rate_limiter,
          frequency: action.frequency
        },
        popBubble: false
      };
    }
    case OPEN_POPBUBBLE:
      if (typeof action.anchor !== "string") {
        return {
          ...state,
          popBubble: !state.popBubble,
          popAnchor: action.anchor
        };
      }
      return { ...state, popBubble: !state.popBubble };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
