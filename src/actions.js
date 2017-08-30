import { register_device, login_u2f } from './u2f';
import setAuthorizationToken from './utils/setAuthorizationToken';
import checkDomain from './api/apiUtils';

export const BLUR_BG = 'BLUR_BG';
export const UNBLUR_BG = 'UNBLUR_BG';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_REROUTE = 'SET_REROUTE';
export const CHECK_AUTH = 'CHECK_AUTH';
export const SET_TEAM = 'SET_TEAM';
export const START_LOGIN = 'START_LOGIN';

// Blur background action
export function blurBG() {
  return { type: BLUR_BG };
}

// Unblur background action
export function unblurBG() {
  return { type: UNBLUR_BG };
}

export function deviceRegisterRequest(emailData, u2f) {
  return (dispatch) => {
    const test = register_device(emailData, u2f);
    test.then((trolo) => console.log("success registration"));
    test.catch((e) =>  console.log(e));
  };
}

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user,
  };
}

function loginIn(bool) {
  return {
    type: START_LOGIN,
    bool,
  };
}

export function loginU2f(u2f, cb) {
  return (dispatch) => {
    dispatch(loginIn(true));
    const test = login_u2f('marilynn@bellamy.com', u2f); //siu@teich.com william@bell.com  sue@blount.com marilynn@bellamy.com
    test.then((res) => {
      dispatch(loginIn(false));
      console.log('successfuly logged in', res);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('clearanceLevel', 'all');
      setAuthorizationToken(res.data.token);
      dispatch(setCurrentUser(res.data.token));
      cb();
    });
    test.catch((e) => {
      console.log('login failed', e);
      if (localStorage.team) {
        console.log('retry')
        dispatch(loginU2f(u2f, cb));
      } else {
        dispatch(loginIn(false));
      }
    });
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('team');
    localStorage.setItem('loginout', true);
    localStorage.setItem('clearanceLevel', '');
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

export function setTeam(path) {
  return {
    type: SET_TEAM,
    team: path,
  };
}

export function checkTeam(domain) {
  return (dispatch) => {
    const promise = checkDomain(domain);
    promise.then((res) => {
      dispatch(setTeam(res));
    });
    promise.catch((e) => {
      dispatch(setTeam('error'));
    });
  };
}

