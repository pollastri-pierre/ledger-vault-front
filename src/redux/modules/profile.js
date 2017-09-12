import { GOT_USER_INFO, LOGOUT } from './auth';

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

