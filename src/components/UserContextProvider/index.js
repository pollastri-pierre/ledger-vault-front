// @flow
import React from "react";
import connectData from "restlay/connectData";
import ProfileQuery from "api/queries/ProfileQuery";
import type { Member } from "data/types";

export const UserContext: React$Context<?Member> = React.createContext(null);

export const withMe = (Comp: React$ComponentType<*>) => (props: Object) => (
  <UserContext.Consumer>
    {me => <Comp {...props} me={me} />}
  </UserContext.Consumer>
);

const UserContextProvider = ({ children, me }: { children: *, me: Member }) => (
  <UserContext.Provider value={me}>{children}</UserContext.Provider>
);

// TODO render loading
export default connectData(UserContextProvider, {
  queries: {
    me: ProfileQuery,
  },
});
