// @flow

import { createContext, useContext } from "react";

import type { Organization } from "data/types";

type OrgContextType = {
  organization: Organization,
  refresh: () => Promise<*>,
};
const OrganizationContext: React$Context<?OrgContextType> = createContext(null);

export const OrganizationContextProvider = OrganizationContext.Provider;
export const useOrganization = () => {
  const org = useContext(OrganizationContext);
  if (!org) {
    throw new Error("No organization in context");
  }
  return org;
};
