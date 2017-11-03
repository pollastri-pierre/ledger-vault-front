//@flow
import { denormalize } from "normalizr";
import apiSpec from "./api-spec";
import mockEntities from "./mock-entities.js";
import network, { NetworkError } from "./network";

let simulateForbiddenForAll = false;

const mockSync = (uri: string, method: string, body: ?Object) => {
  if (simulateForbiddenForAll) {
    throw new NetworkError({ message: "forbidden", status: 403 });
  }
  if (method === "DELETE") {
    return {};
  }

  if (method === "PUT") {
    let m;
    m = /^\/operations\/([^/]+)$/.exec(uri);
    if (m) {
      return {};
    }

    m = /^\/accounts\/([^/]+)$/.exec(uri);
    if (m) {
      return {};
    }
  }

  if (method === "GET") {
    let m;
    m = /^\/accounts\/([^/]+)$/.exec(uri);
    if (m) {
      const account = mockEntities.accounts[m[1]];
      if (account) {
        return denormalize(
          account.id,
          apiSpec.account.responseSchema,
          mockEntities
        );
      } else {
        throw new Error("Account Not Found");
      }
    }
    m = /^\/operations\/([^/]+)$/.exec(uri);
    if (m) {
      const operation = mockEntities.operations[m[1]];
      if (operation) {
        return denormalize(
          operation.uuid,
          apiSpec.operation.responseSchema,
          mockEntities
        );
      } else {
        throw new Error("Account Not Found");
      }
    }

    m = /^\/accounts\/([^/]+)\/operations$/.exec(uri);
    if (m) {
      const account = mockEntities.accounts[m[1]];
      if (account) {
        const opKeys = Object.keys(mockEntities.operations).filter(
          key => mockEntities.operations[key].currency_name === account.currency
        );
        return denormalize(
          opKeys,
          apiSpec.accountOperations.responseSchema,
          mockEntities
        );
      } else {
        throw new Error("Account Not Found");
      }
    }
    switch (uri) {
      case "/currencies":
        return denormalize(
          Object.keys(mockEntities.currencies),
          apiSpec.currencies.responseSchema,
          mockEntities
        );
      case "/organization/members/me":
        return denormalize(
          Object.keys(mockEntities.members)[0],
          apiSpec.profile.responseSchema,
          mockEntities
        );
      case "/organization/members":
        return denormalize(
          Object.keys(mockEntities.members),
          apiSpec.members.responseSchema,
          mockEntities
        );
      case "/organization/approvers":
        return denormalize(
          Object.keys(mockEntities.members).slice(0, 2),
          apiSpec.members.responseSchema,
          mockEntities
        );
      case "/accounts":
        return denormalize(
          Object.keys(mockEntities.accounts),
          apiSpec.accounts.responseSchema,
          mockEntities
        );
      case "/pendings":
        return denormalize(
          {
            approveOperations: Object.keys(mockEntities.operations).slice(0, 4),
            watchOperations: Object.keys(mockEntities.operations).slice(4, 6),
            approveAccounts: Object.keys(mockEntities.accounts).slice(0, 2),
            watchAccounts: Object.keys(mockEntities.accounts).slice(2, 4)
          },
          apiSpec.pendings.responseSchema,
          mockEntities
        );
      case "/dashboard/total-balance":
        return {
          currencyName: "EUR",
          date: new Date().toISOString(),
          value: 1589049,
          valueHistory: {
            yesterday: 1543125,
            week: 1031250,
            month: 2043125
          },
          accountsCount: 5,
          currenciesCount: 4,
          membersCount: 8
        };
      case "/dashboard/last-operations":
        return denormalize(
          Object.keys(mockEntities.operations).slice(0, 6),
          apiSpec.dashboardLastOperations.responseSchema,
          mockEntities
        );
    }
  }
};

const delay = ms => new Promise(success => setTimeout(success, ms));

export default (uri: string, method: string, body: ?Object): Promise<*> => {
  const mockRes = mockSync(uri, method, body);
  if (mockRes) {
    return delay(400 + 400 * Math.random()).then(() => {
      console.warn("mock: " + method + " " + uri, body || "", "\n=>", mockRes);
      return mockRes;
    });
  } else {
    return network(uri, method, body);
  }
};
