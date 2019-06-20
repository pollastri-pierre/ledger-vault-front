// @flow

import { createContext, useContext } from "react";

import type { Organization } from "data/types";

const OrganizationContext: React$Context<?Organization> = createContext(null);

export const OrganizationContextProvider = OrganizationContext.Provider;
export const useOrganization = () => useContext(OrganizationContext);
