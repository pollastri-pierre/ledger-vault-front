import { register_device, login_u2f } from './u2f';
import setAuthorizationToken from './utils/setAuthorizationToken';
import { Route, Redirect, withRouter } from 'react-router-dom';

export const BLUR_BG = 'BLUR_BG';
export const UNBLUR_BG = 'UNBLUR_BG';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_REROUTE = 'SET_REROUTE';
export const CHECK_AUTH = 'CHECK_AUTH';

// Blur background action
export function blurBG() {
  return { type: BLUR_BG };
}

// Unblur background action
export function unblurBG() {
  return { type: UNBLUR_BG };
}

export function deviceRegisterRequest(emailData, u2f, callback) {
  return (dispatch) => {
    const test = register_device(emailData, u2f);
    test.then((trolo) => callback("success registration"));
    test.catch((e) => callback(e));
  };
}

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user,
  };
}

export function loginU2f(emailData, u2f, callback) {
  return (dispatch) => {
    const test = login_u2f(emailData, u2f);
    test.then((res) => {
      localStorage.setItem('token', res.token);
      setAuthorizationToken(res.token);
      dispatch(setCurrentUser(res.token));
      callback();
    });
    test.catch((e) => {
      dispatch(setCurrentUser({}));
      callback(e);
    });
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('token');
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  };
}

export function setReroute(path) {
  return {
    type: SET_REROUTE,
    reroute: path,
  };
}

