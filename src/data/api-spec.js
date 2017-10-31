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
  members: {
    uri: "/organization/members",
    method: "GET",
    responseSchema: [Member]
  },
  approvers: {
    uri: "/organization/approvers",
    method: "GET",
    responseSchema: [Member]
  },
  accounts: {
    uri: "/accounts",
    method: "GET",
    responseSchema: [Account]
  },
  account: {
    uri: ({ accountId }) => `/accounts/${accountId}`,
    method: "GET",
    responseSchema: Account
  },
  operation: {
    uri: ({ operationId }) => `/operations/${operationId}`,
    method: "GET",
    responseSchema: Operation
  },
  accountOperations: {
    uri: ({ accountId }) => `/accounts/${accountId}/operations`,
    method: "GET",
    responseSchema: [Operation]
  },
  pendings: {
    uri: "/pendings",
    method: "GET",
    responseSchema: {
      approveOperations: [Operation],
      watchOperations: [Operation],
      approveAccounts: [Account],
      watchAccounts: [Account]
    }
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
