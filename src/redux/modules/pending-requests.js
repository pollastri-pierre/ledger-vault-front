import _ from 'lodash';
import { LOGOUT } from './auth';
import { ABORTED, APPROVED } from './account-approve';

export const GET_PENDING_REQUESTS_START = 'pending-requests/GET_PENDING_REQUESTS_START';
export const GOT_PENDING_REQUESTS = 'pending-requests/GOT_PENDING_REQUESTS';
export const GOT_PENDING_REQUESTS_FAIL = 'pending-requests/GOT_PENDING_REQUESTS_FAIL';

const account = {
  id: 1,
  name: 'Trackerfund',
  currency: {
    family: 'BITCOIN',
    units: [],
  },
  security_scheme: {
    quorum: 5,
    approvers: ['2323r23', '3rwefef'],
  },
  balance: 2,
  creation_time: new Date(),
};

const account2 = {
  ...account,
  id: 2,
  name: 'LIT Holdings',
  currency: {
    ...account.currency,
    family: 'LITECOIN',
  },
  security_scheme: {
    ...account.security_scheme,
    quorum: 3,
    approvers: ['few'],
  },
};

const account3 = {
  ...account,
  id: 8,
  name: 'Hot wallet',
  currency: {
    ...account.currency,
    family: 'DOGECOIN',
  },
  security_scheme: {
    ...account.security_scheme,
    quorum: 3,
    approvers: [],
  },
};

const account4 = {
  ...account,
  id: 3,
  name: 'Cold storage',
  currency: {
    ...account.currency,
    family: 'LITECOIN',
  },
  security_scheme: {
    ...account.security_scheme,
    quorum: 3,
    approvers: [],
  },
};


const requests = {
  approveOperations: [],
  approveAccounts: [account, account2],
  watchOperations: [],
  watchAccounts: [account3, account4],
};

export function gotPendingRequests(requests) {
  return {
    type: GOT_PENDING_REQUESTS,
    requests,
  };
}

export function gotPendingRequestsFail(status) {
  return {
    type: GOT_PENDING_REQUESTS_FAIL,
    status,
  };
}
export function getPendingRequestsStart() {
  return {
    type: GET_PENDING_REQUESTS_START,
  };
}

export function getPendingRequests() {
  return (dispatch) => {
    dispatch(getPendingRequestsStart());
    setTimeout(() => {
      dispatch(gotPendingRequests(requests));
    }, 800);
  };
}

export const initialState = {
  isLoading: false,
  data: null,
};

export default function reducer(state = initialState, action) {
  const approveAccounts = (state.data) ? state.data.approveAccounts : [];
  const watchAccounts = (state.data) ? state.data.watchAccounts : [];
  switch (action.type) {
    case GET_PENDING_REQUESTS_START:
      return { ...state, isLoading: true };
    case GOT_PENDING_REQUESTS_FAIL:
      return { ...state, isLoading: false };
    case GOT_PENDING_REQUESTS:
      return { ...state, isLoading: false, data: action.requests };
    case APPROVED:
      const accountJustApproved = _.find(approveAccounts, {id: action.accountId});
      _.remove(approveAccounts, {id: action.accountId});

      console.log(accountJustApproved);
      // TODO handle real user hash key
      accountJustApproved.security_scheme.approvers.push('user_hash');

      if (accountJustApproved.security_scheme.approvers.length < accountJustApproved.security_scheme.quorum) {
        watchAccounts.push(accountJustApproved);
      }

      // we update the approvals and check if it goes to account to watch
      return {
        ...state,
        data: {
          ...state.data,
          approveAccounts: approveAccounts,
          watchAccounts: watchAccounts,
        },
      };

    case ABORTED:
      _.remove(approveAccounts, {id: action.accountId});
      return {
        ...state,
        data: {
          ...state.data,
          approveAccounts: approveAccounts,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

