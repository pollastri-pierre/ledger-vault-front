import moxios from "moxios";
import LocalStorageMock from "../../utils/LocalStorageMock";
import reducer, {
  SET_TEAM_FIELD,
  LOGOUT,
  CHECK_TEAM_ERROR,
  GET_USER_INFOS_START,
  CHECK_TEAM_SUCCESS,
  START_AUTHENTICATION,
  AUTHENTICATION_SUCCEED,
  REMOVE_TEAM_ERROR,
  GOT_USER_INFO,
  AUTHENTICATION_FAILED,
  RESET_TEAM,
  gotUserInfos,
  startAuthenticationFlag,
  finishAuthentication,
  authenticationSucceed,
  authenticationFailed,
  startAuthentication,
  startGetUserInfos,
  logout,
  logoutAction,
  resetTeam,
  initialState,
  setTeamField,
  getUserInfos,
  checkTeamError,
  checkTeamSuccess,
  reinitTeamError
} from "../../redux/modules/auth";

describe("Module auth", () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it("authenticationSucceed() should send AUTHENTICATION_SUCCEED", () => {
    expect(authenticationSucceed()).toEqual({
      type: AUTHENTICATION_SUCCEED
    });
  });

  it("setTeamField() should send SET_TEAM_FIELD", () => {
    expect(setTeamField("t")).toEqual({
      type: SET_TEAM_FIELD,
      value: "t"
    });
  });

  it("logout() should send LOGOUT", () => {
    expect(logout()).toEqual({
      type: LOGOUT
    });
  });

  it("logoutAction() should return dispatch and call localstorage", () => {
    const spyLocalStorage = {
      removeItem: jest.fn()
    };

    global.localStorage = spyLocalStorage;

    const thunk = logoutAction();
    const dispatch = jest.fn();

    thunk(dispatch);

    const calls = dispatch.mock.calls;
    expect(calls[0][0]).toEqual({ type: LOGOUT });
    expect(spyLocalStorage.removeItem.mock.calls.length).toBe(1);
  });

  it("startGetUserInfos() should send GET_USER_INFOS_START", () => {
    expect(startGetUserInfos()).toEqual({
      type: GET_USER_INFOS_START
    });
  });

  it("checkTeamError() should send CHECK_TEAM_ERROR", () => {
    expect(checkTeamError(400)).toEqual({
      type: CHECK_TEAM_ERROR,
      status: 400
    });
  });

  it("checkTeamSuccess() should send CHECK_TEAM_SUCCESS", () => {
    expect(checkTeamSuccess()).toEqual({
      type: CHECK_TEAM_SUCCESS
    });
  });

  it("gotUserInfos() should send GOT_USER_INFO", () => {
    expect(gotUserInfos()).toEqual({
      type: GOT_USER_INFO
    });
  });

  it("startAuthenticationFlag() should return START_AUTHENTICATION", () => {
    expect(startAuthenticationFlag()).toEqual({
      type: START_AUTHENTICATION
    });
  });

  it("reinitTeamError() should return REMOVE_TEAM_ERROR", () => {
    expect(reinitTeamError()).toEqual({
      type: REMOVE_TEAM_ERROR
    });
  });

  it("resetTeam() should return RESET_TEAM", () => {
    expect(resetTeam()).toEqual({
      type: RESET_TEAM
    });
  });

  it("authenticationFailed() should return AUTHENTICATION_FAILED", () => {
    expect(authenticationFailed()).toEqual({
      type: AUTHENTICATION_FAILED
    });
  });

  it("finishAuthentication() should handle failure", done => {
    const dispatch = jest.fn();
    const data = { challenge: 2, appId: "1", registeredKeys: [] };
    const thunk = finishAuthentication(data);

    global.u2f = {
      sign: function sign(appId, challenge, registeredKeys, callback) {
        const result = { errorCode: 2 };
        callback(result);
        done();
      }
    };

    const getState = () => ({
      auth: {
        team: "test"
      }
    });

    thunk(dispatch, getState);

    const calls = dispatch.mock.calls;
    expect(calls[0][0]).toEqual({ type: AUTHENTICATION_FAILED });
  });

  it("finishAuthentication() should success", done => {
    const dispatch = jest.fn();
    const data = { challenge: 2, appId: "1", registeredKeys: [] };
    const thunk = finishAuthentication(data);

    global.u2f = {
      sign: function sign(appId, challenge, registeredKeys, callback) {
        const result = {};
        callback(result);
      }
    };

    global.localStorage = new LocalStorageMock();

    const getState = () => ({
      auth: {
        team: "test"
      }
    });

    thunk(dispatch, getState);

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: data
        })
        .then(() => {
          const calls = dispatch.mock.calls;
          // expect(calls[0][0]).toEqual({ type: AUTHENTICATION_SUCCEED });
          // check it dispatch getUserInfos()
          // expect(typeof calls[1][0]).toBe('function');

          const r2 = moxios.requests.mostRecent();
          r2
            .respondWith({
              status: 200
            })
            .then(() => {
              done();
            });
        });
    });
  });

  it("startAuthentication() should return a dispatch", done => {
    const dispatch = jest.fn();
    const data = { challenge: 2 };
    const thunk = startAuthentication();

    const getState = () => ({
      auth: {
        team: "test"
      }
    });

    thunk(dispatch, getState);

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: data
        })
        .then(() => {
          const calls = dispatch.mock.calls;
          expect(calls[0][0]).toEqual({ type: START_AUTHENTICATION });
          expect(calls[1][0]).toEqual({ type: CHECK_TEAM_SUCCESS });
          done();
        });
    });
  });

  it("should handle failure of start_authentication", done => {
    const dispatch = jest.fn();
    const data = { challenge: 2 };
    const thunk = startAuthentication();

    const getState = () => ({
      auth: {
        team: "test"
      }
    });

    thunk(dispatch, getState);

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 400,
          response: data
        })
        .then(() => {
          const calls = dispatch.mock.calls;
          expect(calls[0][0]).toEqual({ type: START_AUTHENTICATION });
          expect(calls[1][0]).toEqual({ type: CHECK_TEAM_ERROR, status: 400 });
          done();
        });
    });
  });

  it("getUserInfos() should return a dispatch and call organization/members/me", done => {
    global.localStorage = new LocalStorageMock();

    const dispatch = jest.fn();
    const data = { id: 2 };
    const thunk = getUserInfos();

    const getState = () => ({
      routing: {
        location: {
          state: {
            from: "/sandbox"
          }
        }
      }
    });

    thunk(dispatch, getState);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: data
        })
        .then(() => {
          const calls = dispatch.mock.calls;
          expect(calls[0][0]).toEqual({ type: GET_USER_INFOS_START });
          expect(calls[1][0]).toEqual({ type: GOT_USER_INFO, user: { id: 2 } });

          expect(calls[2][0]).toEqual({
            type: "@@router/CALL_HISTORY_METHOD",
            payload: { method: "push", args: ["/sandbox"] }
          });
          done();
        });
    });
  });

  it("reducer should set the initialState back", () => {
    const state = { isAuthenticated: true, team: "test", user: {} };
    const action = { type: LOGOUT };
    const stateReduced = initialState;

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it("reducer should set the field value and cancel the teamError", () => {
    const state = { isAuthenticated: true, team: "" };
    const action = { type: SET_TEAM_FIELD, value: "test", teamError: true };
    const stateReduced = {
      isAuthenticated: true,
      team: "test",
      teamError: false
    };

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it("reducer should set the isCheckingTeam to true", () => {
    const state = { isAuthenticated: true, team: "", isCheckingTeam: false };
    const action = { type: START_AUTHENTICATION };
    const stateReduced = {
      isAuthenticated: true,
      team: "",
      isCheckingTeam: true
    };

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it("reducer should set the teamError to true and isCheckingTeam to false", () => {
    const state = {
      isAuthenticated: true,
      team: "",
      teamError: false,
      isCheckingTeam: true
    };
    const action = { type: CHECK_TEAM_ERROR };
    const stateReduced = {
      isAuthenticated: true,
      team: "",
      teamError: true,
      isCheckingTeam: false
    };

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it("reducer should set the errorTeam to false", () => {
    const state = {
      isAuthenticated: true,
      team: "",
      teamError: true,
      isCheckingTeam: false
    };
    const action = { type: REMOVE_TEAM_ERROR };
    const stateReduced = {
      isAuthenticated: true,
      team: "",
      teamError: false,
      isCheckingTeam: false
    };

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it("reducer should set the teamError to false and isCheckingTeam to false, and set the user", () => {
    const state = {
      isAuthenticated: true,
      team: "",
      teamError: true,
      isCheckingTeam: true
    };
    const action = { type: CHECK_TEAM_SUCCESS };
    const stateReduced = {
      isAuthenticated: true,
      teamValidated: true,
      team: "",
      teamError: false,
      isCheckingTeam: false
    };

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it("reducer should set authenticated to true when GOT_USER_INFO", () => {
    const state = initialState;
    const action = { type: GOT_USER_INFO };
    const stateReduced = { ...initialState, isAuthenticated: true };

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it("reducer should set teamValidated to false when AUTHENTICATION_FAILED", () => {
    const state = { ...initialState, teamValidated: true };
    const action = { type: AUTHENTICATION_FAILED };
    const stateReduced = { ...initialState, teamValidated: false };

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it("reducer should set teamValidated to false when RESET_TEAM", () => {
    const state = { ...initialState, teamValidated: true };
    const action = { type: RESET_TEAM };
    const stateReduced = { ...initialState, teamValidated: false };

    expect(reducer(state, action)).toEqual(stateReduced);
  });

  it("reducer should return the state when default is catched", () => {
    const state = { test: "1" };
    const action = { type: "ACTION_NOT_EXIST" };

    expect(reducer(state, action)).toEqual(state);
  });
});
