import axios from "axios";
import { push } from "react-router-redux";
import "u2f-api-polyfill";
import ledger from "ledgerco";

export const SET_TEAM_FIELD = "auth/SET_TEAM_FIELD";
export const LOGOUT = "auth/LOGOUT";
export const START_AUTHENTICATION = "auth/START_AUTHENTICATION";
export const CHECK_TEAM_SUCCESS = "auth/CHECK_TEAM_SUCCESS";
export const CHECK_TEAM_ERROR = "auth/CHECK_TEAM_ERROR";
export const REMOVE_TEAM_ERROR = "auth/REMOVE_TEAM_ERROR";
export const AUTHENTICATION_SUCCEED = "auth/AUTHENTICATION_SUCCEED";
export const AUTHENTICATION_FAILED = "auth/AUTHENTICATION_FAILED";
export const AUTHENTICATION_FAILED_API = "auth/AUTHENTICATION_FAILED_API";
export const AUTHENTICATION_FAILED_TIMEOUT =
  "auth/AUTHENTICATION_FAILED_TIMEOUT";
export const GET_USER_INFOS_START = "auth/GET_USER_INFOS_START";
export const GOT_USER_INFO = "auth/GOT_USER_INFO";
export const RESET_TEAM = "auth/RESET_TEAM";

export function setTeamField(val) {
  return {
    type: SET_TEAM_FIELD,
    value: val
  };
}

export function startAuthenticationFlag() {
  return {
    type: START_AUTHENTICATION
  };
}

export function checkTeamError(status) {
  return {
    type: CHECK_TEAM_ERROR,
    status
  };
}

export function resetTeam() {
  return {
    type: RESET_TEAM
  };
}

export function reinitTeamError() {
  return {
    type: REMOVE_TEAM_ERROR
  };
}

export function checkTeamSuccess() {
  return {
    type: CHECK_TEAM_SUCCESS
  };
}

export function authenticationSucceed() {
  return {
    type: AUTHENTICATION_SUCCEED
  };
}

export function authenticationFailed(e) {
  if (e === 5) {
    return {
      type: AUTHENTICATION_FAILED_TIMEOUT
    };
  } else if (e === "api") {
    return {
      type: AUTHENTICATION_FAILED_API
    };
  }

  return {
    type: AUTHENTICATION_FAILED
  };
}

export function setTokenToLocalStorage(token) {
  window.localStorage.setItem("token", token);
}

export function finishRegistration(data, email) {
  return () => {
    window.u2f.register(
      data.appId,
      data.registerRequests,
      data.registeredKeys,
      deviceResponse => {
        if (deviceResponse.errorCode) {
          // dispatch(authenticationFailed());
        } else {
          axios
            .post("finish_registration", { email, response: deviceResponse })
            .then(res => {
              console.log(res.data);
            });
        }
      }
    );
  };
}

export function registerDevice(email) {
  return dispatch => {
    axios.post("start_registration", { email }).then(res => {
      dispatch(finishRegistration(res.data, email));
    });
  };
}

export function startGetUserInfos() {
  return {
    type: GET_USER_INFOS_START
  };
}

export function gotUserInfos(user) {
  return {
    type: GOT_USER_INFO,
    user
  };
}

export function getUserInfos() {
  return (dispatch, getState) => {
    dispatch(startGetUserInfos());
    const { routing } = getState();

    return axios
      .get("/organization/members/me", {
        headers: { "X-Ledger-Auth": window.localStorage.getItem("token") }
      })
      .then(res => {
        dispatch(gotUserInfos(res.data));
        if (
          routing.location &&
          routing.location.state &&
          routing.location.state.from
        ) {
          dispatch(push(routing.location.state.from));
        }
      });
  };
}
export function finishAuthentication(data) {
  return (dispatch, getState) => {
    const { team } = getState().auth;

    window.u2f.sign(
      data.appId,
      data.challenge,
      data.registeredKeys,
      deviceResponse => {
        if (deviceResponse.errorCode) {
          dispatch(authenticationFailed(deviceResponse.errorCode));
        } else {
          axios
            .post("finish_authentication", {
              email: team,
              response: deviceResponse
            })
            .then(res => {
              setTimeout(() => {
                dispatch(authenticationSucceed());
              }, 500);
              setTokenToLocalStorage(res.data.token);
              dispatch(getUserInfos());
            })
            .catch(() => {
              dispatch(authenticationFailed("api"));
            });
        }
      }
    );
  };
}

export function startAuthentication() {
  return (dispatch, getState) => {
    dispatch(startAuthenticationFlag());
    const { team } = getState().auth;

    axios
      .post("start_authentication", { email: team })
      .then(res => {
        dispatch(checkTeamSuccess());
        dispatch(finishAuthentication(res.data));
      })
      .catch(e => {
        dispatch(checkTeamError(e.response.status));
      });
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}

export function logoutAction() {
  return dispatch => {
    dispatch(logout());
    window.localStorage.removeItem("token");
  };
}

export const initialState = {
  isAuthenticated: false,
  isCheckingTeam: false,
  teamValidated: false,
  teamError: false,
  team: ""
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_TEAM_FIELD:
      return { ...state, team: action.value, teamError: false };
    case LOGOUT:
      return initialState;
    case CHECK_TEAM_ERROR:
      return { ...state, teamError: true, isCheckingTeam: false };
    case CHECK_TEAM_SUCCESS:
      return {
        ...state,
        teamError: false,
        isCheckingTeam: false,
        teamValidated: true
      };
    case REMOVE_TEAM_ERROR:
      return { ...state, teamError: false };
    case START_AUTHENTICATION:
      return { ...state, isCheckingTeam: true };
    case RESET_TEAM:
      return { ...state, teamValidated: false };
    case GOT_USER_INFO:
      return { ...state, isAuthenticated: true };
    case AUTHENTICATION_FAILED_API:
    case AUTHENTICATION_FAILED_TIMEOUT:
    case AUTHENTICATION_FAILED:
      return { ...state, teamValidated: false };
    default:
      return state;
  }
}
