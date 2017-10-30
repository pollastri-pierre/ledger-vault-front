import { LOGOUT } from "../../redux/modules/auth";

import reducer, {
  initialState,
  gotPendingRequests,
  gotPendingRequestsFail,
  getPendingRequestsStart,
  getPendingRequests,
  GOT_PENDING_REQUESTS,
  GOT_PENDING_REQUESTS_FAIL,
  GET_PENDING_REQUESTS_START
} from "../../redux/modules/pending-requests";

describe("pending-requests module", () => {
  it("gotPendingRequests() should return GOT_PENDING_REQUESTS and the requests", () => {
    expect(gotPendingRequests({})).toEqual({
      type: GOT_PENDING_REQUESTS,
      requests: {}
    });
  });

  it("gotPendingRequestsFail() should return GOT_PENDING_REQUESTS_FAIL and the status", () => {
    expect(gotPendingRequestsFail(400)).toEqual({
      type: GOT_PENDING_REQUESTS_FAIL,
      status: 400
    });
  });

  it("getPendingRequestsStart() should return GET_PENDING_REQUESTS_START", () => {
    expect(getPendingRequestsStart()).toEqual({
      type: GET_PENDING_REQUESTS_START
    });
  });

  // testing reducers

  it("reducer should set isLoading to true when GET_PENDING_REQUESTS_START", () => {
    expect(
      reducer(initialState, {
        type: GET_PENDING_REQUESTS_START
      })
    ).toEqual({ ...initialState, isLoading: true });
  });

  it("reducer should set isLoading to false and set the data at GOT_PENDING_REQUESTS", () => {
    const state = { ...initialState, isLoading: true };
    expect(
      reducer(state, {
        type: GOT_PENDING_REQUESTS,
        requests: {}
      })
    ).toEqual({ ...state, isLoading: false, data: {} });
  });

  it("reducer should set isLoading to false when GOT_PENDING_REQUESTS_FAIL", () => {
    const state = { ...initialState, isLoading: true };
    expect(
      reducer(state, {
        type: GOT_PENDING_REQUESTS_FAIL,
        status: 400
      })
    ).toEqual({ ...state, isLoading: false });
  });

  it("reducer should reset the state at LOGOUT", () => {
    const state = { ...initialState, data: {} };
    expect(
      reducer(state, {
        type: LOGOUT
      })
    ).toEqual(initialState);
  });
});
