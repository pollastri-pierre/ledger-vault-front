//@flow
import { account } from './schema';

type APISpec = {
  uri: string | ((params: *) => string),
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
    responseSchema: [account]
  }
};

export default api;
