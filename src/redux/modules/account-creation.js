//@flow
import _ from "lodash";
import { LOGOUT } from "./auth";
import type { Member, ERC20Token } from "data/types";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { isValidAccountName } from "utils/accounts";

export const CHANGE_TAB = "account-creation/CHANGE_TAB";
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

const UPDATE_ACCOUNT_CREATION_STATE = "account-creation/UPDATE_STATE";

export type Timelock = {
  enabled: boolean,
  value: number,
  frequency: number
};

export type Ratelimiter = {
  enabled: boolean,
  value: number,
  frequency: number
};

export type UpdateState = ((State) => $Shape<State>) => void;

export function updateAccountCreationState(updater: State => $Shape<State>) {
  return {
    type: UPDATE_ACCOUNT_CREATION_STATE,
    updater
  };
}

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

export function changeAccountName(name: string) {
  if (isValidAccountName(name)) {
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

type ParentAccount = { id: string } | { name: string };

export type State = {
  // UI FIELDS (used to store the tab, and the sub modal id)
  currentTab: number,
  internModalId:
    | "members"
    | "approvals"
    | "time-lock"
    | "rate-limiter"
    | "device"
    | "main",

  // -- COMMON FIELDS FOR CURRENCY & ERC20
  name: string,
  approvers: Member[],
  quorum: number,
  time_lock: Timelock,
  rate_limiter: Ratelimiter,

  // -- CURRENCY SPECIFIC
  currency: ?CryptoCurrency,

  // -- ERC20TOKEN SPECIFIC
  erc20token: ?ERC20Token,
  parent_account: ?ParentAccount,

  // TODO: is it used (except in tests)?
  popBubble: boolean,
  popAnchor: ?Node
};

export const initialState: State = {
  // UI FIELDS (used to store the tab, and the sub modal id)
  currentTab: 0,
  internModalId: "main",

  // -- COMMON FIELDS FOR CURRENCY & ERC20
  name: "",
  approvers: [],
  quorum: 0,
  time_lock: { enabled: false, value: 0, frequency: 60 },
  rate_limiter: { enabled: false, value: 0, frequency: 84600 },

  // -- CURRENCY SPECIFIC
  currency: null,

  // -- ERC20TOKEN SPECIFIC
  erc20token: null,
  parent_account: null,

  // TODO: is it used (except in tests)?
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
    case UPDATE_ACCOUNT_CREATION_STATE:
      return {
        ...state,
        ...action.updater(state)
      };
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
