//@flow
import { Account, Member, Operation, Currency } from "./schema";

export type APISpec = {
  uri: string | ((_: Object) => string),
  method: string,
  responseSchema: Object | Array<Object>,
  cached?: boolean
};
type API = { [_: string]: APISpec };

// TODO: how to express the response type per API with flowtype? same with input type
// TODO: different cache strategy. for instance, it's ok to cache /accounts because not much things should change BUT it should still refresh in some cases. cache invalidation can be tricky so we don't want to think about this too early

/**
 * This specifies the API and how it maps to the schema model
 */

const verbsByHTTPMethod = {
  PUT: "updated",
  POST: "created",
  DELETE: "deleted"
};

const genericRenderNotif = (resource, verb) => ({
  title: `${resource} ${verbsByHTTPMethod[verb]}`,
  content: `the ${resource} has been successfully ${verbsByHTTPMethod[verb]}`
});

const api: API = {
  currencies: {
    uri: "/currencies",
    method: "GET",
    responseSchema: [Currency],
    cached: true
  },
  profile: {
    uri: "/organization/members/me",
    method: "GET",
    responseSchema: Member,
    logoutUserIfStatusCode: 403
  },
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
  saveProfile: {
    uri: "/organization/members/me",
    method: "PUT",
    notif: {
      title: "Profile updated",
      content: "Your profile informations have been successfully updated"
    },
    // input : Member
    responseSchema: Member
  },
  abortAccount: {
    uri: ({ accountId }) => `/accounts/${accountId}`,
    method: "DELETE",
    notif: genericRenderNotif("account request", "DELETE"),
    responseSchema: Account
  },
  approveAccount: {
    uri: ({ accountId }) => `/accounts/${accountId}`,
    method: "PUT",
    notif: genericRenderNotif("account request", "PUT"),
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
    notif: genericRenderNotif("operation request", "DELETE"),
    responseSchema: Operation
  },
  approveOperation: {
    uri: ({ operationId }) => `/operations/${operationId}`,
    method: "PUT",
    notif: genericRenderNotif("operation request", "PUT"),
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
  dashboardTotalBalance: {
    uri: "/dashboard/total-balance",
    method: "GET",
    responseSchema: {}
    // This API is needed because we can't compute all informations ourself
    // this returns this:
    /*
    {
      date: string, // the calculation time (probably "now")
      balance: number,
      currency_name: string,
      balanceHistory: {
        // this is the historically counter value balance at a given time in the past
        // we can't calculate it ourself because we need to know the rate at a given time
        yesterday: number,
        week: number,
        month: number
      },
      accountsCount: number,
      currenciesCount: number,
      membersCount: number
    }
    */
  },
  dashboardLastOperations: {
    uri: "/dashboard/last-operations",
    method: "GET",
    responseSchema: [Operation]
  }
};

export default api;
