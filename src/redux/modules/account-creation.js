//@flow
import _ from "lodash";
import { LOGOUT } from "./auth";
import type { Member } from "data/types";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

export const CHANGE_TAB = "account-creation/CHANGE_TAB";
export const SELECT_CURRENCY = "account-creation/SELECT_CURRENCY";
export const CHANGE_ACCOUNT_NAME = "account-creation/CHANGE_ACCOUNT_NAME";
export const SWITCH_INTERN_MODAL = "account-creation/SWITCH_INTERN_MODAL";
export const ADD_MEMBER = "account-creation/ADD_MEMBER";
export const REMOVE_MEMBER = "account-creation/REMOVE_MEMBER";
export const SET_APPROVALS = "account-creation/SET_APPROVALS";
export const SET_TIMELOCK = "account-creation/SET_TIMELOCK";
export const SET_RATELIMITER = "account-creation/SET_RATELIMITER";
export const OPEN_POPBUBBLE = "account-creation/OPEN_POPBUBBLE";
export const CLEAR_STATE = "account-creation/CLEAR_STATE";

export const SAVE_ACCOUNT_START = "account-creation/SAVE_ACCOUNT_START";
export const SAVED_ACCOUNT = "account-creation/SAVED_ACCOUNT";
export const SAVED_ACCOUNT_FAIL = "account-creation/SAVED_ACCOUNT_FAIL";
const MAX_ACCOUNT_NAME_LENGTH = 20;

type Timelock = {
  enabled: boolean,
  value: number,
  frequency: number
};

type Ratelimiter = {
  enabled: boolean,
  value: number,
  frequency: number
};

export function openPopBubble(anchor: ?Node) {
  return {
    type: OPEN_POPBUBBLE,
    anchor
  };
}

export function setTimelock(timelock: Timelock) {
  return {
    type: SET_TIMELOCK,
    timelock
  };
}

export function setRatelimiter(ratelimiter: Ratelimiter) {
  return {
    type: SET_RATELIMITER,
    ratelimiter
  };
}

export function addMember(member: Member) {
  return {
    type: ADD_MEMBER,
    member
  };
}

export function setApprovals(number: number) {
  return {
    type: SET_APPROVALS,
    number
  };
}

export function removeMember(member: Member) {
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

export function changeTab(index: number) {
  return {
    type: CHANGE_TAB,
    index
  };
}

export function selectCurrencyItem(currency: CryptoCurrency) {
  return {
    type: SELECT_CURRENCY,
    currency
  };
}

const hasMoreThanAscii = str =>
  str.split("").some(function(char) {
    return char.charCodeAt(0) > 127;
  });
export function changeAccountName(name: string) {
  if (name.length < MAX_ACCOUNT_NAME_LENGTH && !hasMoreThanAscii(name)) {
    return {
      type: CHANGE_ACCOUNT_NAME,
      name
    };
  }
}

export function switchInternalModal(id: string) {
  return {
    type: SWITCH_INTERN_MODAL,
    id
  };
}

export function selectCurrency(currency: CryptoCurrency) {
  return (dispatch: Function) => {
    dispatch(selectCurrencyItem(currency));
    dispatch(changeTab(1));
  };
}

type Freq = number;

export type State = {
  currentTab: number,
  currency: ?CryptoCurrency,
  name: string,
  approvers: Member[],
  quorum: number,
  time_lock: {
    enabled: boolean,
    value: number,
    frequency: Freq
  },
  rate_limiter: {
    enabled: boolean,
    value: number,
    frequency: Freq
  },
  internModalId:
    | "members"
    | "approvals"
    | "time-lock"
    | "rate-limiter"
    | "device"
    | "main",
  popBubble: boolean,
  popAnchor: ?Node
};

export const initialState: State = {
  currentTab: 0,
  currency: null,
  name: "",
  approvers: [],
  quorum: 0,
  time_lock: {
    enabled: false,
    value: 0,
    frequency: 60
  },
  rate_limiter: {
    enabled: false,
    value: 0,
    frequency: 84600
  },
  internModalId: "main",
  popBubble: false,
  popAnchor: null
};

export default function reducer(
  state: State = initialState,
  action: Object
): State {
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

      // reset approvals if approvers.length < approvals
      let quorum = _.cloneDeep(state.quorum);

      if (cMembers.length < quorum) {
        quorum = 0;
      }

      return {
        ...state,
        quorum: quorum,
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
          quorum: parseInt(action.number, 10) || 0
        };
      }

      return state;
    }
    case CHANGE_TAB:
      return { ...state, currentTab: action.index };
    case SELECT_CURRENCY:
      return { ...state, currency: action.currency };
    case SET_TIMELOCK: {
      return { ...state, time_lock: action.timelock };
    }
    case SET_RATELIMITER: {
      return { ...state, rate_limiter: action.ratelimiter };
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
