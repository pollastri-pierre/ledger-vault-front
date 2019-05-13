// @flow
import React from "react";
import type { User } from "data/types";

export const UserContext: React$Context<?User> = React.createContext(null);

export const withMe = (Comp: React$ComponentType<*>) => (props: Object) => (
  <UserContext.Consumer>
    {me => <Comp {...props} me={me} />}
  </UserContext.Consumer>
);

const UserContextProvider = ({ children, me }: { children: *, me: User }) => (
  <UserContext.Provider value={me}>{children}</UserContext.Provider>
);

export default UserContextProvider;
