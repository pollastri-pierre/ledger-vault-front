// @flow
import type { Dispatch } from "redux";
import network from "network";

export const LOGOUT = "auth/LOGOUT";
export const LOGIN = "auth/LOGIN";

const TOKEN_NAME = "token";

export function getCookieToken() {
  // avoid fail in test env
  if (document.cookie) {
    const cookieToken = getCookie(TOKEN_NAME);
    if (cookieToken && cookieToken !== "") return cookieToken;
  }
  return null;
}

export function removeTokenFromCookies() {
  removeCookie(TOKEN_NAME);
}

export function setTokenToCookies(token: string) {
  document.cookie = `${TOKEN_NAME}=${token}; path=/`;
}

export const logout = () => async (dispatch: Dispatch<*>) => {
  try {
    await network(`/authentications/logout`, "POST");
    removeTokenFromCookies();
  } catch (e) {
    removeTokenFromCookies();
  }
  dispatch({
    type: LOGOUT,
  });
};

export function login(token: string) {
  // setTokenToCookies(token);
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

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return parts
      .pop()
      .split(";")
      .shift();
}

function removeCookie(name) {
  document.cookie = `${name}= ; path=/ ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
}
