//@flow
import { Account, Member, Operation } from "./schema";

export type APISpec = {
  uri: string | ((_: Object) => string),
  method: string,
  responseSchema: Object | Array<Object>
};
type API = { [_: string]: APISpec };

// TODO: how to express the response type per API with flowtype? same with input type
// TODO: different cache strategy. for instance, it's ok to cache /accounts because not much things should change BUT it should still refresh in some cases. cache invalidation can be tricky so we don't want to think about this too early

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
  approvers: {
    uri: "/organization/approvers",
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
  abortAccount: {
    uri: ({ accountId }) => `/accounts/${accountId}`,
    method: "DELETE",
    responseSchema: Account
  },
  approveAccount: {
    uri: ({ accountId }) => `/accounts/${accountId}`,
    method: "PUT",
    responseSchema: Account
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
  abortOperation: {
    uri: ({ operationId }) => `/operations/${operationId}`,
    method: "DELETE",
    responseSchema: Operation
  },
  approveOperation: {
    uri: ({ operationId }) => `/operations/${operationId}`,
    method: "PUT",
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
