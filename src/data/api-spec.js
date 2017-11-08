//@flow
import { Account, Member, Operation, Currency } from "./schema";
import APIQuerySpec from "../restlay/APIQuerySpec";
import APIMutationSpec from "../restlay/APIMutationSpec";

// NB we might split into many files if defining a spec have more thing

const verbsByHTTPMethod = {
  PUT: "updated",
  POST: "created",
  DELETE: "deleted"
};

const genericRenderNotif = (resource, verb) => ({
  title: `${resource} ${verbsByHTTPMethod[verb]}`,
  content: `the ${resource} has been successfully ${verbsByHTTPMethod[verb]}`
});

/**
 * This specifies the API and how it maps to the schema model
 */

export const currencies = new APIQuerySpec({
  uri: "/currencies",
  method: "GET",
  responseSchema: [Currency],
  cacheMaxAge: 60
});

export const profile = new APIQuerySpec({
  uri: "/organization/members/me",
  method: "GET",
  responseSchema: Member,
  logoutUserIfStatusCode: 403
});

export const accounts = new APIQuerySpec({
  uri: "/accounts",
  method: "GET",
  responseSchema: [Account]
});

export const members = new APIQuerySpec({
  uri: "/organization/members",
  method: "GET",
  responseSchema: [Member]
});

export const approvers = new APIQuerySpec({
  uri: "/organization/approvers",
  method: "GET",
  responseSchema: [Member]
});

export const saveProfile = new APIMutationSpec({
  uri: "/organization/members/me",
  method: "PUT",
  notif: {
    title: "Profile updated",
    content: "Your profile informations have been successfully updated"
  },
  // input : Member
  responseSchema: Member
});

export const newAccount = new APIMutationSpec({
  uri: "/organization/account",
  method: "POST",
  notif: {
    title: "Account request created",
    content: "The account request has been successfully created"
  },
  responseSchema: Account
});

export const abortAccount = new APIMutationSpec({
  uri: ({ accountId }) => `/accounts/${accountId}`,
  method: "DELETE",
  notif: genericRenderNotif("account request", "DELETE"),
  responseSchema: Account
});

export const approveAccount = new APIMutationSpec({
  uri: ({ accountId }) => `/accounts/${accountId}`,
  method: "PUT",
  notif: genericRenderNotif("account request", "PUT"),
  responseSchema: Account
});

export const account = new APIQuerySpec({
  uri: ({ accountId }) => `/accounts/${accountId}`,
  method: "GET",
  responseSchema: Account
});

export const operation = new APIQuerySpec({
  uri: ({ operationId }) => `/operations/${operationId}`,
  method: "GET",
  responseSchema: Operation
});

export const abortOperation = new APIMutationSpec({
  uri: ({ operationId }) => `/operations/${operationId}`,
  method: "DELETE",
  notif: genericRenderNotif("operation request", "DELETE"),
  responseSchema: Operation
});

export const approveOperation = new APIMutationSpec({
  uri: ({ operationId }) => `/operations/${operationId}`,
  method: "PUT",
  notif: genericRenderNotif("operation request", "PUT"),
  responseSchema: Operation
});

export const accountOperations = new APIQuerySpec({
  uri: ({ accountId }) => `/accounts/${accountId}/operations`,
  method: "GET",
  responseSchema: [Operation]
});

export const pendings = new APIQuerySpec({
  uri: "/pendings",
  method: "GET",
  responseSchema: {
    approveOperations: [Operation],
    watchOperations: [Operation],
    approveAccounts: [Account],
    watchAccounts: [Account]
  }
});

export type TotalBalanceResponse = {
  // this is the expected response type of dashboardTotalBalance
  date: string, // the calculation time (probably "now")
  balance: number,
  currencyName: string,
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
};
export const dashboardTotalBalance = new APIQuerySpec({
  uri: "/dashboard/total-balance",
  method: "GET"
});

export const dashboardLastOperations = new APIQuerySpec({
  uri: "/dashboard/last-operations",
  method: "GET",
  responseSchema: [Operation]
});
