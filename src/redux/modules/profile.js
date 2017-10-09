import { GOT_USER_INFO, LOGOUT } from './auth';

export const OPEN_CLOSE_PROFILE = 'profile/OPEN_CLOSE_PROFILE';
export const OPEN_CLOSE_EDIT = 'profile/OPEN_CLOSE_EDIT';

export const initialState = {
  user: {},
  open: false,
  openEdit: false,
};

export function openCloseProfile(target) {
  return {
    type: OPEN_CLOSE_PROFILE,
    target,
  };
}

export function openCloseEdit() {
  return {
    type: OPEN_CLOSE_EDIT,
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GOT_USER_INFO:
      return { ...state, user: action.user };
    case OPEN_CLOSE_PROFILE: {
      const target = action.target;
      if (typeof target === 'object') {
        return { ...state, open: !state.open, target: action.target };
      }
      return { ...state, open: !state.open };
    }
    case OPEN_CLOSE_EDIT:
      return { ...state, openEdit: !state.openEdit };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

