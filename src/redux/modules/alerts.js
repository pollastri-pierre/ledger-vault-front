import _ from 'lodash';
import { CHECK_TEAM_ERROR, AUTHENTICATION_FAILED, LOGOUT, AUTHENTICATION_SUCCEED } from './auth';

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

