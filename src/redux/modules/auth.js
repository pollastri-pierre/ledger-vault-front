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

export const logout = () => {
  return async (dispatch: Dispatch<*>) => {
    try {
      await network(`/authentications/logout`, "POST");
      removeLocalStorageToken();
    } catch (e) {
      removeLocalStorageToken();
    }
    dispatch({
      type: LOGOUT
    });
  };
};

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
    case LOGIN:
      return { isAuthenticated: true };
    default:
      return state;
  }
}
