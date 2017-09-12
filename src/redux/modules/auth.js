import axios from 'axios';
import u2f from 'u2f-api-polyfill';
import { push } from 'react-router-redux';
// import u2fApi from 'u2f-api';

export const SET_TEAM_FIELD = 'auth/SET_TEAM_FIELD';
export const LOGOUT = 'auth/LOGOUT';
export const START_AUTHENTICATION = 'auth/START_AUTHENTICATION';
export const CHECK_TEAM_SUCCESS = 'auth/CHECK_TEAM_SUCCESS';
export const CHECK_TEAM_ERROR = 'auth/CHECK_TEAM_ERROR';
export const REMOVE_TEAM_ERROR = 'auth/REMOVE_TEAM_ERROR';
export const AUTHENTICATION_SUCCEED = 'auth/AUTHENTICATION_SUCCEED';
export const AUTHENTICATION_FAILED = 'auth/AUTHENTICATION_FAILED';
export const GET_USER_INFOS_START = 'auth/GET_USER_INFOS_START';
export const GOT_USER_INFO = 'auth/GOT_USER_INFO';
export const RESET_TEAM = 'auth/RESET_TEAM';

export function setTeamField(val) {
  return {
    type: SET_TEAM_FIELD,
    value: val
  };
};

export function startAuthenticationFlag() {
  return {
    type: START_AUTHENTICATION
  }
};

export function checkTeamError() {
  return {
    type: CHECK_TEAM_ERROR
  }
};

export function resetTeam() {
  return {
    type: RESET_TEAM
  }
};

export function reinitTeamError() {
  return {
    type: REMOVE_TEAM_ERROR
  }
};

export function checkTeamSuccess() {
  return {
    type: CHECK_TEAM_SUCCESS
  }
};

export function authenticationSucceed() {
  return {
    type: AUTHENTICATION_SUCCEED
  }
};

export function authenticationFailed() {
  return {
    type: AUTHENTICATION_FAILED
  }
};

export function setTokenToLocalStorage(token) {
  window.localStorage.setItem('token', token);
};

export function finishRegistration(data, email) {
  return (dispatch) => {
    window.u2f.register(data.appId, data.registerRequests, data.registeredKeys, (deviceResponse) => {
      console.log(deviceResponse);
      if (deviceResponse.errorCode) {
        // dispatch(authenticationFailed());
      }
      else {
        axios.post('finish_registration', {email: email, response: deviceResponse })
             .then((res) => {
               // console.log(res.data);
             })
             .catch((e) => {
             });
          }
    });
  };
};

export function registerDevice(email) {
  return (dispatch, getState) => {
    axios.post('start_registration', {email: email})
         .then((res) => {
           dispatch(finishRegistration(res.data, email));
         })
         .catch((e) => {
         });
  };
};

export function startAuthentication() {
  return (dispatch, getState) => {
    dispatch(startAuthenticationFlag());
    const { team } = getState().auth;

    axios.post('start_authentication', {email: team}, {headers: {"Access-Control-Allow-Origin": '*'}})
         .then((res) => {
           dispatch(checkTeamSuccess());
           dispatch(finishAuthentication(res.data));
         })
         .catch((e) => {
           dispatch(checkTeamError());
               // dispatch(authenticationSucceed());
               // setTokenToLocalStorage("forcedtoken");
               // dispatch(getUserInfos());
           // dispatch(authenticationSucceed());
           // setTokenToLocalStorage("forcedToken");
         });
  };
};

export function finishAuthentication(data) {
  return (dispatch, getState) => {
    const { team } = getState().auth;

    window.u2f.sign(data.appId, data.challenge, data.registeredKeys, (deviceResponse) => {
      if (deviceResponse.errorCode) {
        dispatch(authenticationFailed());
      }
      else {
        axios.post('finish_authentication', {email: team, response: deviceResponse })
             .then((res) => {
               dispatch(authenticationSucceed());
               setTokenToLocalStorage(res.data.token);
               dispatch(getUserInfos());
             })
             .catch((e) => {
              dispatch(authenticationFailed());
             });
          }
    });

  };
};

export function startGetUserInfos() {
  return {
    type: GET_USER_INFOS_START
  }
};

export function gotUserInfos(user) {
  return {
    type: GOT_USER_INFO,
    user: user
  }
};

export function getUserInfos() {
  return (dispatch, getState) => {
    dispatch(startGetUserInfos());
    
    const data = {id: '1', email: 'florent.teissier@ledger.fr'};
    const { routing } = getState();

    // const promise = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     dispatch(gotUserInfos(data))
    //     if (routing.location && routing.location.state && routing.location.state.from) {
    //       dispatch(push(routing.location.state.from));
    //     }
    //     resolve();
    //   }, 2000);
    // });

    // return promise;

    return axios.get('organization/members/me', {headers: {"X-Ledger-Auth": window.localStorage.getItem('token')}})
         .then((res) => {
           dispatch(gotUserInfos(res.data));
              if (routing.location && routing.location.state && routing.location.state.from) {
                dispatch(push(routing.location.state.from));
              }
         })
         .catch((e) => {
         });
  };
};

export function logout() {
  return {
    type: LOGOUT
  };
};

export function logoutAction() {
  return (dispatch) => {
    dispatch(logout());
    window.localStorage.removeItem('token');
  };
};

export const initialState = {
  isAuthenticated: false,
  isCheckingTeam: false,
  teamValidated: false,
  teamError: false,
  team: '',
  user: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_TEAM_FIELD:
      return {...state, team: action.value};
    case LOGOUT:
      return initialState;
    case CHECK_TEAM_ERROR:
      return {...state, teamError: true, isCheckingTeam: false};
    case CHECK_TEAM_SUCCESS:
      return {...state, teamError: false, isCheckingTeam: false, teamValidated: true};
    case REMOVE_TEAM_ERROR:
      return {...state, teamError: false};
    case START_AUTHENTICATION:
      return {...state, isCheckingTeam: true};
    case RESET_TEAM:
      return {...state, teamValidated: false};
    case GOT_USER_INFO:
      return {...state, user: action.user, isAuthenticated: true};
    default:
      return state;
  }
}

