//@flow
export const LOGOUT = "auth/LOGOUT";
export const LOGIN = "auth/LOGIN";
import network from "network";

export function getLocalStorageToken() {
  // avoid fail in test env
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("token");
  }
}

export function removeLocalStorageToken() {
  window.localStorage.removeItem("token");
}

export function setTokenToLocalStorage(token: string) {
  window.localStorage.setItem("token", token);
}

export function logout() {
  removeLocalStorageToken();
  network("/authentications/authenticate", "DELETE");
  return { type: LOGOUT };
}

export function login(token: string) {
  setTokenToLocalStorage(token);
  return { type: LOGIN };
}

export type State = {
  isAuthenticated: boolean
};

export default function reducer(
  state: State = {
    isAuthenticated: !!getLocalStorageToken()
  },
  action: Object
) {
  switch (action.type) {
    case LOGOUT:
      return { isAuthenticated: false };
    case "DATA_FETCHED_FAIL": {
      const shouldLogout =
        action.error.status &&
        action.error.status === action.queryOrMutation.logoutUserIfStatusCode;
      if (shouldLogout) {
        removeLocalStorageToken();
        return { isAuthenticated: false };
      } else {
        return state;
      }
    }
    case LOGIN:
      return { isAuthenticated: true };
    default:
      return state;
  }
}
