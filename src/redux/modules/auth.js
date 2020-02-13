// @flow
import type { Dispatch } from "redux";
import network from "network";

export const LOGOUT = "auth/LOGOUT";
export const LOGIN = "auth/LOGIN";

export const logout = (params: ?{ autoLogin: boolean } = {}) => async (
  dispatch: Dispatch<*>,
) => {
  try {
    await network(`/authentications/logout`, "POST");
  } catch {
    // We tried to logout and it failed, but no need to raise anything.
  }
  dispatch({
    type: LOGOUT,
    payload: { autoLogin: params ? params.autoLogin : false },
  });
};

export const checkLogin = () => async (dispatch: Dispatch<*>) => {
  try {
    const res = await network(`/authentications/status`, "GET");
    if (res.authenticated === true) {
      dispatch(login());
    }
  } catch {
    // do nothing if network call fail. isAuthenticated remains false.
  }
};

export function login() {
  return { type: LOGIN };
}

export type State = {
  isAuthenticated: boolean,
};

export default function reducer(
  state: State = {
    // Since we don't control the auth token (handled by the back)
    // we assume that we are authenticated by default, fetch the
    // requested page, and only set isAuth to false in case of fail
    isAuthenticated: false,
  },
  action: Object,
) {
  switch (action.type) {
    case LOGOUT:
      return { isAuthenticated: false, autoLogin: action.payload.autoLogin };
    case LOGIN:
      return { isAuthenticated: true, autoLogin: false };
    default:
      return state;
  }
}
