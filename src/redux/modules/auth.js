import axios from 'axios';

export const SET_TEAM_FIELD = 'auth/SET_TEAM_FIELD';
export const LOGOUT = 'auth/LOGOUT';
export const START_AUTHENTICATION = 'auth/START_AUTHENTICATION';
export const CHECK_TEAM_SUCCESS = 'auth/CHECK_TEAM_SUCCESS';
export const CHECK_TEAM_ERROR = 'auth/CHECK_TEAM_ERROR';
export const REMOVE_TEAM_ERROR = 'auth/REMOVE_TEAM_ERROR';
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

export function startAuthentication() {
  return (dispatch, getState) => {
    dispatch(startAuthenticationFlag());
    const { team } = getState().auth;

    axios.post('start_registration', {email: team})
         .then((res) => {
           dispatch(checkTeamSuccess());
         })
         .catch((e) => {
           // dispatch(checkTeamSuccess());
           dispatch(checkTeamError());
         });
  };
};

export function logout() {
  return {
    type: LOGOUT
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
    default:
      return state;
  }
}

