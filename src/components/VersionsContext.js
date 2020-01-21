// @flow

import { createContext, useContext } from "react";

type Version = { [string]: Object };
type ContextType = {
  versions: ?Version,
  update: () => Promise<*>,
};
const VersionsContext: React$Context<?ContextType> = createContext(null);

export const VersionsContextProvider = VersionsContext.Provider;
export const useVersions = () => {
  const versions = useContext(VersionsContext);
  if (!versions) {
    throw new Error("No versions in context");
  }
  return versions;
};
