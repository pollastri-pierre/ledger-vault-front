import _ from "lodash";
import { LOGOUT } from "./auth";
import { ABORTED, APPROVED } from "./account-approve";
import { SAVED_ACCOUNT } from "./account-creation";
import currencies from "../../currencies";

export const GET_PENDING_REQUESTS_START =
  "pending-requests/GET_PENDING_REQUESTS_START";
export const GOT_PENDING_REQUESTS = "pending-requests/GOT_PENDING_REQUESTS";
export const GOT_PENDING_REQUESTS_FAIL =
  "pending-requests/GOT_PENDING_REQUESTS_FAIL";

const account = {
  id: 1,
  name: "Trackerfund",
  currency: currencies[0],
  approved: ["edoiooooooo"],
  creation_time: new Date()
};

const account2 = {
  ...account,
  id: 2,
  name: "LIT Holdings",
  currency: currencies[1],
  approved: ["edoiooooooo", "fewrfsdiekjfkdsjk"]
};

const account3 = {
  ...account,
  id: 8,
  name: "Hot wallet",
  currency: currencies[2],
  approved: ["edoiooooooo", "fewrfsdiekjfkdsjk", "ewfwekljfkujkljlkj"]
};

const account4 = {
  ...account,
  id: 3,
  name: "Cold storage",
  currency: currencies[3],
  approved: ["edoiooooooo", "fewrfsdiekjfkdsjk", "ewfwekljfkujkljlkj"]
};

const requests = {
  approveOperations: [],
  approveAccounts: [account, account2],
  watchOperations: [],
  watchAccounts: [account3, account4]
};

export function gotPendingRequests(requests) {
  return {
    type: GOT_PENDING_REQUESTS,
    requests
  };
}

export function gotPendingRequestsFail(status) {
  return {
    type: GOT_PENDING_REQUESTS_FAIL,
    status
  };
}
export function getPendingRequestsStart() {
  return {
    type: GET_PENDING_REQUESTS_START
  };
}

export function getPendingRequests() {
  return dispatch => {
    dispatch(getPendingRequestsStart());
    setTimeout(() => {
      dispatch(gotPendingRequests(requests));
    }, 800);
  };
}

export const initialState = {
  isLoading: false,
  data: null
};

export default function reducer(state = initialState, action) {
  const approveAccounts = state.data ? state.data.approveAccounts : [];
  const watchAccounts = state.data ? state.data.watchAccounts : [];
  switch (action.type) {
    case GET_PENDING_REQUESTS_START:
      return { ...state, isLoading: true };
    case GOT_PENDING_REQUESTS_FAIL:
      return { ...state, isLoading: false };
    case GOT_PENDING_REQUESTS:
      return { ...state, isLoading: false, data: action.requests };
    case APPROVED:
      const accountJustApproved = _.find(approveAccounts, {
        id: action.accountId
      });
      _.remove(approveAccounts, { id: action.accountId });

      accountJustApproved.approved.push(account.pub_key);
      watchAccounts.push(accountJustApproved);

      return {
        ...state,
        data: {
          ...state.data,
          approveAccounts: approveAccounts,
          watchAccounts: watchAccounts
        }
      };
    case ABORTED:
      _.remove(approveAccounts, { id: action.accountId });
      return {
        ...state,
        data: {
          ...state.data,
          approveAccounts: approveAccounts
        }
      };
    case SAVED_ACCOUNT:
      approveAccounts.push(action.account);
      if (_.isNull(state.data)) {
        return state;
      }
      return {
        ...state,
        data: {
          ...state.data,
          approveAccounts: approveAccounts
        }
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
