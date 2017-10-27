//@flow
import { Account, Member, Operation } from './schema';

export type APISpec = {
  uri: string | ((_: Object) => string),
  method: string,
  responseSchema: Object | Array<Object>
};
type API = { [_: string]: APISpec };

/**
 * This specifies the API and how they map to the schema model
 */

const api: API = {
  members: {
    uri: '/members',
    method: 'GET',
    responseSchema: [Member]
  },
  accounts: {
    uri: '/accounts',
    method: 'GET',
    responseSchema: [Account]
  },
  account: {
    // just an example, not actually yet used
    uri: ({ accountId }) => `/accounts/${accountId}`,
    method: 'GET',
    responseSchema: Account
  },
  dashboard: {
    uri: '/dashboard',
    method: 'GET',
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
    }
  }
};

export default api;
