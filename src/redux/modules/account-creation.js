// @flow
import type { ERC20Token } from "data/types";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { LOGOUT } from "./auth";

export const SET_APPROVALS = "account-creation/SET_APPROVALS";
export const CLEAR_STATE = "account-creation/CLEAR_STATE";

export const SAVE_ACCOUNT_START = "account-creation/SAVE_ACCOUNT_START";
export const SAVED_ACCOUNT = "account-creation/SAVED_ACCOUNT";
export const SAVED_ACCOUNT_FAIL = "account-creation/SAVED_ACCOUNT_FAIL";

const UPDATE_ACCOUNT_CREATION_STATE = "account-creation/UPDATE_STATE";

export type UpdateState = ((State) => $Shape<State>) => void;

export function updateAccountCreationState(updater: State => $Shape<State>) {
  return {
    type: UPDATE_ACCOUNT_CREATION_STATE,
    updater
  };
}

export function clearState() {
  return {
    type: CLEAR_STATE
  };
}

export type ParentAccount = { id: number } | { name: string };
export type InternModalId = "members" | "approvals" | "device" | "main";

export type State = {
  // UI FIELDS (used to store the tab, and the sub modal id)
  currentTab: number,
  internModalId: InternModalId,

  // -- COMMON FIELDS FOR CURRENCY & ERC20
  name: string,
  approvers: string[],
  quorum: number,

  // -- CURRENCY SPECIFIC
  currency: ?CryptoCurrency,

  // -- ERC20TOKEN SPECIFIC
  erc20token: ?ERC20Token,
  parent_account: ?ParentAccount
};

export const initialState: State = {
  // UI FIELDS (used to store the tab, and the sub modal id)
  currentTab: 0,
  internModalId: "main",

  // -- COMMON FIELDS FOR CURRENCY & ERC20
  name: "",
  approvers: [],
  quorum: 0,

  // -- CURRENCY SPECIFIC
  currency: null,

  // -- ERC20TOKEN SPECIFIC
  erc20token: null,
  parent_account: null
};

export default function reducer(
  state: State = initialState,
  action: Object
): State {
  switch (action.type) {
    case CLEAR_STATE:
    case LOGOUT:
      return initialState;
    case UPDATE_ACCOUNT_CREATION_STATE:
      return {
        ...state,
        ...action.updater(state)
      };
    default:
      return state;
  }
}
