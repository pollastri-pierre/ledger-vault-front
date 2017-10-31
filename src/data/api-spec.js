//@flow
import { Account, Member, Operation } from "./schema";

export type APISpec = {
  uri: string | ((_: Object) => string),
  method: string,
  responseSchema: Object | Array<Object>
};
type API = { [_: string]: APISpec };

/**
 * This specifies the API and how it maps to the schema model
 */

const api: API = {
  accounts: {
    uri: "/accounts",
    method: "GET",
    responseSchema: [Account]
  },
  members: {
    uri: "/organization/members",
    method: "GET",
    responseSchema: [Member]
  },
  profile: {
    uri: "/organization/members/me",
    method: "GET",
    responseSchema: Member
  },
  saveProfile: {
    uri: "/organization/members/me",
    method: "PUT",
    // input : Member
    responseSchema: Member
  },
  account: {
    uri: ({ accountId }) => `/accounts/${accountId}`,
    method: "GET",
    responseSchema: Account
  },
  accountOperations: {
    uri: ({ accountId }) => `/accounts/${accountId}/operations`,
    method: "GET",
    responseSchema: [Operation]
  },
  dashboard: {
    uri: "/dashboard",
    method: "GET",
    responseSchema: {
      lastOperations: [Operation],
      pending: {
        operations: [Operation],
        accounts: [Account]
        /*
        total: number,
        totalAccounts: number,
        totalOperations: number
        */
      }
      /*
      totalBalance: {
        currencyName: string,
        date: string,
        value: number,
        valueHistory: {
          yesterday: number,
          week: number,
          month: number
        },
        accountsCount: number,
        currenciesCount: number,
        membersCount: number
      }
      */
    }
  }
};

export default api;
