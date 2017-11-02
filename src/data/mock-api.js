//@flow
import { denormalize } from "normalizr";
import apiSpec from "./api-spec";
import mockEntities from "./mock-entities.js";
import network from "./network";

const mockSync = (uri: string, method: string, body: ?Object) => {
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
      case "/organization/members":
        return denormalize(
          Object.keys(mockEntities.members),
          apiSpec.members.responseSchema,
          mockEntities
        );
      case "/accounts":
        return denormalize(
          Object.keys(mockEntities.accounts),
          apiSpec.accounts.responseSchema,
          mockEntities
        );
      case "/dashboard":
        return denormalize(
          {
            lastOperations: Object.keys(mockEntities.operations).slice(0, 6),
            pending: {
              operations: Object.keys(mockEntities.operations).slice(6, 9),
              accounts: Object.keys(mockEntities.accounts).slice(1, 3),
              total: 7,
              totalAccounts: 3,
              totalOperations: 4
            },
            totalBalance: {
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
            }
          },
          apiSpec.dashboard.responseSchema,
          mockEntities
        );
    }
  }

  return network(uri, method, body);
};

const delay = ms => new Promise(success => setTimeout(success, ms));

export default (uri: string, method: string, body: ?Object): Promise<*> =>
  delay(400 + 400 * Math.random()).then(() => mockSync(uri, method, body));
