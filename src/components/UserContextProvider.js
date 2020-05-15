// @flow
import React, { useContext } from "react";
import type { User } from "data/types";

export const UserContext: React$Context<?User> = React.createContext(null);

export const withMe = (Comp: React$ComponentType<*>) => (props: Object) => (
  <UserContext.Consumer>
    {(me) => <Comp {...props} me={me} />}
  </UserContext.Consumer>
);

const UserContextProvider = ({ children, me }: { children: *, me: User }) => (
  <UserContext.Provider value={me}>{children}</UserContext.Provider>
);

export const useMe = () => {
  const me = useContext(UserContext);
  if (!me) {
    throw new Error("Trying to access me without me being set");
  }
  return me;
};

export default UserContextProvider;
