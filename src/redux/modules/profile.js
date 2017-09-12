import axios from 'axios';
import { GOT_USER_INFO, LOGOUT } from './auth';

export const START_FETCHING = 'START_FETCHING';
export const GOT_PROFILE = 'GOT_PROFILE';

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GOT_USER_INFO:
      return action.user;
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

