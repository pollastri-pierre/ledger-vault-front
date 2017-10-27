//@flow
import { mockGET } from './mock-api';
import type { APISpec } from './api-spec';

const delay = ms => new Promise(success => setTimeout(success, ms));

const resolveURI = ({ uri }: APISpec, apiParams: ?Object): string =>
  typeof uri === 'function' ? uri(apiParams || {}) : uri;

export default (spec: APISpec, apiParams: ?Object, body: ?Object): Promise<*> =>
  delay(400 + 400 * Math.random()).then(() => {
    if (spec.method !== 'GET') {
      throw new Error('no mock supported yet for method=' + spec.method);
    }
    return mockGET(resolveURI(spec, apiParams));
  });
