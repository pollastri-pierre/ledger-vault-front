//@flow
import { denormalize } from "normalizr";
import apiSpec from "./api-spec";
import mockEntities from "./mock-entities.js";
import { getJSON } from "./network";

const mockGETSync = (uri: string) => {
  let m;
  m = /\/accounts\/(.+)/.exec(uri);
  if (m) {
    const account = mockEntities.accounts[m[1]];
    if (account) {
      return denormalize(
        account.id,
        apiSpec.account.responseSchema,
        mockEntities
      );
    }
  }
  m = /\/accounts\/(.+)\/operations/.exec(uri);
  if (m) {
    const account = mockEntities.accounts[m[1]];
    if (account) {
      return denormalize(
        Object.keys(mockEntities.operations).slice(2, 7),
        apiSpec.accountOperations.responseSchema,
        mockEntities
      );
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

  return getJSON(uri);
};

const delay = ms => new Promise(success => setTimeout(success, ms));

export const mockGET = (uri: string): Promise<*> =>
  delay(400 + 400 * Math.random()).then(() => mockGETSync(uri));
