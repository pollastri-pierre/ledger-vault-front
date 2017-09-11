// import moxios from 'moxios';
import reducer,
  { SET_TEAM_FIELD,
    LOGOUT,
    CHECK_TEAM_ERROR,
    CHECK_TEAM_SUCCESS,
    START_AUTHENTICATION,
    REMOVE_TEAM_ERROR,
    startAuthenticationFlag,
    startAuthentication,
    logout,
    initialState,
    setTeamField,
    checkTeamError,
    checkTeamSuccess,
    reinitTeamError
  }
from '../../redux/modules/auth';

describe('Module auth', () => {
  // beforeEach(() => {
  //   moxios.install();
  // });
  //
  // afterEach(() => {
  //   moxios.uninstall();
  // });

  it('setTeamField() should send SET_TEAM_FIELD', () => {
    expect(setTeamField('t')).toEqual({
      type: SET_TEAM_FIELD,
      value: 't'
    });
  });

  it('checkTeamError() should send CHECK_TEAM_ERROR', () => {
    expect(checkTeamError()).toEqual({
      type: CHECK_TEAM_ERROR
    });
  });

  it('checkTeamSuccess() should send CHECK_TEAM_SUCCESS', () => {
    expect(checkTeamSuccess()).toEqual({
      type: CHECK_TEAM_SUCCESS
    });
  });

  it('logout() should return LOGOUT', () => {
    expect(logout()).toEqual({
      type: LOGOUT
    });
  });

  it('startAuthenticationFlag() should return START_AUTHENTICATION', () => {
    expect(startAuthenticationFlag()).toEqual({
      type: START_AUTHENTICATION
    });
  });

  it('reinitTeamError() should return REMOVE_TEAM_ERROR', () => {
    expect(reinitTeamError()).toEqual({
      type: REMOVE_TEAM_ERROR
    });
  });

  it('reducer should set the initialState back', () => {
    const state = {isAuthenticated: true, team: 'test', user: {}};
    const action = {type: LOGOUT};
    const stateReduced = initialState;

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should set the field value', () => {
    const state = {isAuthenticated: true, team: '', user: {}};
    const action = {type: SET_TEAM_FIELD, value: 'test'};
    const stateReduced = {isAuthenticated: true, team: 'test', user: {}};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should set the isCheckingTeam to true', () => {
    const state = {isAuthenticated: true, team: '', isCheckingTeam: false, user: {}};
    const action = {type: START_AUTHENTICATION};
    const stateReduced = {isAuthenticated: true, team: '', user: {}, isCheckingTeam: true};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should set the teamError to true and isCheckingTeam to false', () => {
    const state = {isAuthenticated: true, team: '', teamError: false, isCheckingTeam: true, user: {}};
    const action = {type: CHECK_TEAM_ERROR};
    const stateReduced = {isAuthenticated: true, team: '', teamError: true, user: {}, isCheckingTeam: false};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should set the errorTeam to false', () => {
    const state = {isAuthenticated: true, team: '', teamError: true, isCheckingTeam: false, user: {}};
    const action = {type: REMOVE_TEAM_ERROR};
    const stateReduced = {isAuthenticated: true, team: '', user: {}, teamError: false, isCheckingTeam: false};

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it('reducer should set the teamError to false and isCheckingTeam to false, and set the user', () => {
    const state = {isAuthenticated: true, team: '', teamError: true, isCheckingTeam: true, user: {}};
    const action = {type: CHECK_TEAM_SUCCESS};
    const stateReduced = {isAuthenticated: true, teamValidated: true, team: '', user: {}, teamError: false, isCheckingTeam: false};

    expect(reducer(state, action)).toEqual(stateReduced);
  });


});

