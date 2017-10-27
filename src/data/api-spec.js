//@flow
import { Account, Operation } from './schema';

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
  accounts: {
    uri: '/accounts',
    method: 'GET',
    responseSchema: [Account]
  },
  account: {
    uri: ({ accountId }) => `/accounts/${accountId}`,
    method: 'GET',
    responseSchema: Account
  },
  dashboard: {
    uri: '/dashboard',
    method: 'GET',
    responseSchema: {
      lastOperations: [Operation]
      // pending: [what type goes here?]
    }
  }
};

export default api;
