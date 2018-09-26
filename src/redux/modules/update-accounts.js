//@flow
import type { Account, Member } from "data/types";

const TOGGLE = "UPDATE-ACCOUNTS/TOGGLE";
const SELECT_ACCOUNT = "UPDATE-ACCOUNTS/SELECT-ACCOUNT";
const TOGGLE_MEMBERS = "UPDATE-ACCOUNTS/TOGGLE-MEMBERS";
const TOGGLE_APPROVALS = "UPDATE-ACCOUNTS/TOGGLE-APPROVALS";
const TOGGLE_MEMBER = "UPDATE-ACCOUNTS/TOGGLE-MEMBER";
const TOGGLE_DEVICE = "UPDATE-ACCOUNTS/TOGGLE-DEVICE";
const EDIT_QUORUM = "UPDATE-ACCOUNTS/EDIT-QUORUM";

export const toggleModal = () => ({
  type: TOGGLE
});

export const toggleDevice = () => ({
  type: TOGGLE_DEVICE
});

export const selectAccount = (account: ?Account) => ({
  type: SELECT_ACCOUNT,
  account
});

export const toggleMember = (member: Member) => ({
  type: TOGGLE_MEMBER,
  member
});

export const toggleMembers = () => ({
  type: TOGGLE_MEMBERS
});

export const editQuorum = (quorum: string) => ({
  type: EDIT_QUORUM,
  quorum
});

export const toggleApprovals = () => ({
  type: TOGGLE_APPROVALS
});

export const toggleAndSelect = (account: ?Account) => {
  return (dispatch: Function) => {
    dispatch(toggleModal());
    dispatch(selectAccount(account));
  };
};

type State = {
  isOpen: boolean,
  isDevice: boolean,
  isSelectingMembers: boolean,
  members: Member[],
  quorum: number,
  isSelectingApprovals: boolean,
  account: ?Account
};

const initialState = {
  isOpen: false,
  isDevice: false,
  isSelectingMembers: false,
  isSelectingApprovals: false,
  members: [],
  quorum: 0,
  account: null
};
export default function reducer(state: State = initialState, action: Object) {
  switch (action.type) {
    case TOGGLE: {
      return { ...state, isOpen: !state.isOpen };
    }
    case TOGGLE_DEVICE: {
      return { ...state, isDevice: !state.isDevice, isOpen: !state.isOpen };
    }
    case SELECT_ACCOUNT: {
      return { ...initialState, account: action.account, isOpen: true };
    }
    case TOGGLE_MEMBERS: {
      return {
        ...state,
        isSelectingMembers: !state.isSelectingMembers,
        isOpen: !state.isOpen
      };
    }
    case TOGGLE_APPROVALS: {
      return {
        ...state,
        isSelectingApprovals: !state.isSelectingApprovals,
        isOpen: !state.isOpen
      };
    }
    case EDIT_QUORUM: {
      return { ...state, quorum: parseInt(action.quorum, 10) || 0 };
    }
    case TOGGLE_MEMBER: {
      const index = state.members.indexOf(action.member);
      if (index > -1) {
        return {
          ...state,
          members: [
            ...state.members.slice(0, index),
            ...state.members.slice(index + 1, state.members.length)
          ]
        };
      }
      return { ...state, members: [...state.members, action.member] };
    }
    default:
      return state;
  }
}
