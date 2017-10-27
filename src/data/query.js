//@flow
import { mockGET } from './mock-api';
import type { APISpec } from './api-spec';

const getJSON = mockGET;

const resolveURI = ({ uri }: APISpec, apiParams: ?Object): string =>
  typeof uri === 'function' ? uri(apiParams || {}) : uri;

export default (
  spec: APISpec,
  apiParams: ?Object,
  body: ?Object
): Promise<*> => {
  const uri = resolveURI(spec, apiParams);
  if (spec.method === 'GET') {
    return getJSON(uri);
  }
  throw new Error('no mock supported yet for method=' + spec.method);
};
