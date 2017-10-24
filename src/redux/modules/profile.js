import axios from 'axios';
import { getUserInfos, GOT_USER_INFO, LOGOUT } from './auth';

export const OPEN_CLOSE_PROFILE = 'profile/OPEN_CLOSE_PROFILE';
export const OPEN_CLOSE_EDIT = 'profile/OPEN_CLOSE_EDIT';
export const OPEN_EDIT = 'profile/OPEN_EDIT';
export const CLOSE_EDIT = 'profile/CLOSE_EDIT';

export const SAVE_PROFILE_INVALID = 'profile/SAVE_PROFILE_INVALID';
export const SAVE_PROFILE_FAIL = 'profile/SAVE_PROFILE_FAIL';
export const SAVED_PROFILE = 'profile/SAVED_PROFILE';

export const initialState = {
  user: {},
  open: false,
  openEdit: false,
};

export function saveProfileInvalid() {
  return {
    type: SAVE_PROFILE_INVALID,
  };
}
export function saveProfileFail() {
  return {
    type: SAVE_PROFILE_FAIL,
  };
}

export function savedProfile() {
  return {
    type: SAVED_PROFILE,
  };
}

export function openCloseProfile(target) {
  return {
    type: OPEN_CLOSE_PROFILE,
    target,
  };
}

export function openEdit() {
  return {
    type: OPEN_EDIT,
  };
}

export function closeEdit() {
  return {
    type: CLOSE_EDIT,
  };
}

export function openCloseEdit() {
  return (dispatch, getState) => {
    const { profile } = getState();

    if (profile.openEdit) {
      dispatch(closeEdit());
    } else {
      dispatch(openEdit());
    }
  };
}

export function saveProfile(error, profile) {
  if (error) {
    return (dispatch) => {
      dispatch(saveProfileInvalid());
    };
  }

  return (dispatch) => {
    axios.put('/organization/members/me', profile, { headers: { 'X-Ledger-Auth': window.localStorage.getItem('token') } }).then(() => {
      dispatch(savedProfile());
      dispatch(closeEdit());
      dispatch(getUserInfos());
    }).catch((e) => {
      dispatch(saveProfileFail(e));
    });
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
    case OPEN_EDIT:
      return { ...state, openEdit: true };
    case CLOSE_EDIT:
      return { ...state, openEdit: false };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

