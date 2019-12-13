// @flow
import type { Dispatch } from "redux";
import network from "network";

export const LOGOUT = "auth/LOGOUT";
export const LOGIN = "auth/LOGIN";

export const logout = () => async (dispatch: Dispatch<*>) => {
  try {
    await network(`/authentications/logout`, "POST");
  } catch {
  }
  dispatch({
    type: LOGOUT,
  });
};

export function login() {
  return { type: LOGIN };
}

export type State = {
  isAuthenticated: boolean,
};

export default function reducer(
  state: State = {
    isAuthenticated: true,
  },
  action: Object,
) {
  switch (action.type) {
    case LOGOUT:
      return { isAuthenticated: false };
    case LOGIN:
      return { isAuthenticated: true };
    default:
      return state;
  }
}

