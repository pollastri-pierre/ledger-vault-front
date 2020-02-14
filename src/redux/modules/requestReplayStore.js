// @flow
//
import type {
  GroupEditData,
  AccountEditData,
  WhitelistEditData,
  Account,
  Group,
  User,
  Whitelist,
  Transaction,
} from "data/types";

const SET_REQUEST = "requestReplay/SET_REQUEST";

type Action = {
  type: string,
  request?: RequestReplay,
};

type Create<T> = {
  type: "CREATE",
  entity: T,
};

type Edit<T, S> = {
  type: "EDIT",
  entity: T,
  edit_data: S,
};

export type EditAccountReplay = Edit<Account, AccountEditData>;
export type CreateAccountReplay = Create<Account>;

export type CreateGroupReplay = Create<Group>;
export type EditGroupReplay = Edit<Group, GroupEditData>;

export type CreateWhitelistReplay = Create<Whitelist>;
export type EditWhitelistReplay = Edit<Whitelist, WhitelistEditData>;

export type CreateTransactionReplay = Create<Transaction>;
export type CreateUserInvitationReplay = Create<User>;

export type RequestReplay =
  | EditAccountReplay
  | CreateAccountReplay
  | EditWhitelistReplay
  | CreateWhitelistReplay
  | EditGroupReplay
  | CreateGroupReplay
  | CreateUserInvitationReplay
  | CreateTransactionReplay;

type State = ?RequestReplay;

export const setRequest = (request: ?RequestReplay) => {
  return {
    type: SET_REQUEST,
    request,
  };
};

export const resetRequest = () => {
  return {
    type: SET_REQUEST,
    request: null,
  };
};

const initialState = null;

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case SET_REQUEST:
      return action.request;
    default:
      return state;
  }
}
