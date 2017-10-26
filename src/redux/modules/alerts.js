import _ from 'lodash';
import {
  CHECK_TEAM_ERROR,
  AUTHENTICATION_FAILED_API,
  AUTHENTICATION_FAILED,
  AUTHENTICATION_FAILED_TIMEOUT,
  LOGOUT,
  AUTHENTICATION_SUCCEED,
} from './auth';
import { SAVED_ACCOUNT } from './account-creation';
import { SAVE_PROFILE_INVALID, SAVE_PROFILE_FAIL, SAVED_PROFILE } from './profile';
import { ABORTED, APPROVED } from './account-approve';

export const REMOVE_MESSAGE = 'messages/REMOVE_MESSAGE';

export function closeMessage(id) {
  return {
    type: REMOVE_MESSAGE,
    id,
  };
}

const addToTabs = (state, message) => {
  state.alerts.push(message);
  state.cache.push(message);
};

const initialState = {
  alerts: [],
  cache: [],
};

export default function reducer(state = initialState, action) {
  const status = `${action.status}`;

  if (status && status.lastIndexOf('50', 0) === 0) {
    const copy = _.cloneDeep(state);
    addToTabs(copy, {
      id: action.type,
      type: 'error',
      title: 'error.error5xTitle',
      content: 'error.error5xContent',
    });

    return copy;
  }

  switch (action.type) {
    case APPROVED: {
      const copy = _.cloneDeep(state);
      addToTabs(copy, {
        id: APPROVED,
        type: 'success',
        title: 'account.approveSuccessTitle',
        content: 'account.approveSuccessBody',
      });

      return copy;
    }
    case ABORTED: {
      const copy = _.cloneDeep(state);
      addToTabs(copy, {
        id: ABORTED,
        type: 'success',
        title: 'account.abortSuccessTitle',
        content: 'account.abortSuccessBody',
      });

      return copy;
    }
    case SAVED_ACCOUNT: {
      const copy = _.cloneDeep(state);
      addToTabs(copy, {
        id: SAVED_ACCOUNT,
        type: 'success',
        title: 'account.creationSuccessTitle',
        content: 'account.creationSuccessBody',
      });

      return copy;
    }
    case CHECK_TEAM_ERROR: {
      const copy = _.cloneDeep(state);
      addToTabs(copy, {
        id: CHECK_TEAM_ERROR,
        type: 'error',
        title: 'login.wrongDomainTitle',
        content: 'login.wrongDomainMessage',
      });

      return copy;
    }
    case AUTHENTICATION_FAILED_API: {
      const copy = _.cloneDeep(state);
      addToTabs(copy, {
        id: AUTHENTICATION_FAILED_API,
        type: 'error',
        title: 'login.apiErrorTitle',
        content: 'login.apiErrorMessage',
      });
      return copy;
    }
    case AUTHENTICATION_FAILED_TIMEOUT: {
      const copy = _.cloneDeep(state);
      addToTabs(copy, {
        id: AUTHENTICATION_FAILED_TIMEOUT,
        type: 'error',
        title: 'login.timeoutTitle',
        content: 'login.timeoutMessage',
      });
      return copy;
    }
    case AUTHENTICATION_FAILED: {
      const copy = _.cloneDeep(state);
      addToTabs(copy, {
        id: AUTHENTICATION_FAILED,
        type: 'error',
        title: 'login.wrongDomainTitle',
        content: 'login.wrongDomainMessage',
      });
      return copy;
    }
    case LOGOUT: {
      const copy = _.cloneDeep(state);
      addToTabs(copy, {
        id: LOGOUT,
        type: 'success',
        title: 'login.logoutTitle',
        content: 'login.logoutMessage',
      });
      return copy;
    }
    case AUTHENTICATION_SUCCEED: {
      const copy = _.cloneDeep(state);
      addToTabs(copy, {
        id: AUTHENTICATION_SUCCEED,
        type: 'success',
        title: 'login.welcomeTitle',
        content: 'login.welcomeMessage',
      });
      return copy;
    }
    case SAVED_PROFILE: {
      const copy = _.cloneDeep(state);
      addToTabs(copy, {
        id: SAVED_PROFILE,
        type: 'success',
        title: 'profile.updateSuccess.title',
        content: 'profile.updateSuccess.content',
      });
      return copy;
    }
    case SAVE_PROFILE_INVALID: {
      const copy = _.cloneDeep(state);
      addToTabs(copy, {
        id: SAVE_PROFILE_INVALID,
        type: 'error',
        title: 'profile.updateInvalid.title',
        content: 'profile.updateInvalid.content',
      });
      return copy;
    }
    case SAVE_PROFILE_FAIL: {
      const copy = _.cloneDeep(state);
      addToTabs(copy, {
        id: SAVE_PROFILE_FAIL,
        type: 'error',
        title: 'profile.updateFailure.title',
        content: 'profile.updateFailure.content',
      });
      return copy;
    }
    case REMOVE_MESSAGE: {
      const alerts = _.cloneDeep(state.alerts);
      const index = _.findIndex(alerts, { id: action.id });
      alerts.splice(index, 1);

      return { ...state, alerts };
    }
    default:
      return state;
  }
}
