import _ from 'lodash';
import { CHECK_TEAM_ERROR, AUTHENTICATION_FAILED, LOGOUT } from './auth';

export const REMOVE_MESSAGE = 'messages/REMOVE_MESSAGE';

const initialState = [];

export function closeMessage(id) {
  return {
    type: REMOVE_MESSAGE,
    id,
  };
}

const removeByIndex = (array, index) => array.filter((a, i) => i !== index);


export default function reducer(state = initialState, action) {
  const status = `${action.status}`;

  if (status && status.lastIndexOf('50', 0) === 0) {
    return [...initialState, {
      id: action.type,
      type: 'error',
      title: 'error.error5xTitle',
      content: 'error.error5xContent',
    }];
  }

  switch (action.type) {
    case CHECK_TEAM_ERROR:
      return [...initialState, {
        id: CHECK_TEAM_ERROR,
        type: 'error',
        title: 'login.wrongDomainTitle',
        content: 'login.wrongDomainMessage',
      }];
    case AUTHENTICATION_FAILED:
      return [...initialState, {
        id: AUTHENTICATION_FAILED,
        type: 'error',
        title: 'login.wrongDomainTitle',
        content: 'login.wrongDomainMessage',
      }];
    case LOGOUT:
      return [...initialState, {
        id: LOGOUT,
        type: 'success',
        title: 'login.logoutTitle',
        content: 'login.logoutMessage',
      }];
    case REMOVE_MESSAGE: {
      const index = _.findIndex(state, { id: action.id });
      return removeByIndex(state, index);
    }
    default:
      return state;
  }
}

