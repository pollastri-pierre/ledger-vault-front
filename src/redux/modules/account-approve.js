import { LOGOUT } from "./auth";

export const OPEN_ACCOUNT_APPROVE = "approve-account/OPEN_ACCOUNT_APPROVE";
export const CLOSE_ACCOUNT_APPROVE = "approve-account/CLOSE_ACCOUNT_APPROVE";
export const GET_ACCOUNT_TO_APPROVE_START =
  "approve-account/GET_ACCOUNT_TO_APPROVE_START";
export const GOT_ACCOUNT_TO_APPROVE = "approve-account/GOT_ACCOUNT_TO_APPROVE";
export const GOT_ACCOUNT_TO_APPROVE_FAIL =
  "approve-account/GOT_ACCOUNT_TO_APPROVE_FAIL";
export const ABORTING = "approve-account/ABORTING";
export const ABORT_START = "approve-account/ABORT_START";
export const ABORTED_FAIL = "approve-account/ABORTED_FAIL";
export const ABORTED = "approve-account/ABORTED";

export const APPROVE_START = "approve-account/APPROVE_START";
export const APPROVED = "approve-account/APPROVED";
export const APPROVED_FAIL = "approve-account/APPROVED_FAIL";

const account = {
  id: 1,
  name: "Trackerfund",
  currency: {
    family: "BITCOIN",
    units: [
      {
        name: "Bitcoin",
        symbol: "BTC"
      }
    ]
  },
  security: {
    approvals: 2,
    members: [
      "fewrfsdiekjfkdsjk",
      "edoiooooooo",
      "eooeoqwfdksjkjl",
      "wewoleoolele"
    ],
    timelock: {
      enabled: true,
      duration: 3
    },
    ratelimiter: {}
  },
  creation_time: new Date(),
  approved: ["ewfwekljfkujkljlkj"]
};

export function approveStart() {
  return {
    type: APPROVE_START
  };
}

export function approvedFail() {
  return {
    type: APPROVED_FAIL
  };
}

export function approved(accountId) {
  return (dispatch, getState) => {
    const { profile } = getState();

    dispatch({
      type: APPROVED,
      accountId,
      pub_key: profile.user.pub_key || "" // TODO remove when API fixed ( now it sends null )
    });
  };
}

export function finishApprove(accountId) {
  return dispatch => {
    setTimeout(() => {
      dispatch(approved(accountId));
    }, 500);
  };
}

export function approving() {
  return (dispatch, getState) => {
    dispatch(approveStart());
    const { accountApprove } = getState();
    if (accountApprove.isDevice) {
      setTimeout(() => {
        dispatch(finishApprove(accountApprove.account.id));
      }, 2000);
    }
  };
}

export function abortStart() {
  return {
    type: ABORT_START
  };
}

export function aborted(accountId) {
  return {
    type: ABORTED,
    accountId
  };
}

export function abortedFail() {
  return {
    type: ABORTED_FAIL
  };
}

export function abort() {
  return (dispatch, getState) => {
    dispatch(abortStart());
    const { accountApprove } = getState();
    setTimeout(() => {
      dispatch(aborted(accountApprove.account.id));
    }, 500);
  };
}

export function getAccountToApproveStart() {
  return {
    type: GET_ACCOUNT_TO_APPROVE_START
  };
}

export function aborting() {
  return {
    type: ABORTING
  };
}

export function gotAccountToApprove(account) {
  return {
    type: GOT_ACCOUNT_TO_APPROVE,
    account
  };
}

export function gotAccountToApproveFail(status) {
  return {
    type: GOT_ACCOUNT_TO_APPROVE_FAIL,
    status
  };
}

export function getAccountToApprove() {
  return dispatch => {
    dispatch(getAccountToApproveStart());
    setTimeout(() => {
      dispatch(gotAccountToApprove(account));
    }, 800);
  };
}

export function openAccountApprove(account, isApproved = false) {
  return {
    type: OPEN_ACCOUNT_APPROVE,
    account,
    isApproved
  };
}

export function closeAccountApprove() {
  return {
    type: CLOSE_ACCOUNT_APPROVE
  };
}

export const initialState = {
  modalOpened: false,
  isLoading: false,
  account: null,
  accountId: null,
  isApproved: false,
  isAborting: false,
  isDevice: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_ACCOUNT_TO_APPROVE_START:
      return { ...state, isLoading: true };
    case GOT_ACCOUNT_TO_APPROVE:
      return {
        ...state,
        isLoading: false,
        account: {
          ...state.account,
          security: action.account.security
        }
      };
    case GOT_ACCOUNT_TO_APPROVE_FAIL:
      return { ...state, isLoading: false };
    case OPEN_ACCOUNT_APPROVE:
      return {
        ...state,
        modalOpened: true,
        account: action.account,
        isLoading: true,
        isApproved: action.isApproved
      };
    case CLOSE_ACCOUNT_APPROVE:
      return initialState;
    case ABORT_START:
      return { ...state, modalOpened: false, isAborting: false };
    case APPROVE_START:
      return { ...state, isDevice: !state.isDevice };
    case ABORTED:
      return { ...state, account: null, accountId: null };
    case APPROVED:
      return initialState;
    case ABORTED_FAIL:
      return state;
    case ABORTING:
      return { ...state, isAborting: !state.isAborting };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
