//@flow
import { denormalize } from 'normalizr';
import apiSpec from './api-spec';
import currencies from '../currencies';
import mockEntitiesJSON from './mock-entities.js';
const mockEntities = { ...mockEntitiesJSON };
const currenciesMap = {};
currencies.forEach(c => {
  currenciesMap[c.name] = c;
});
mockEntities.currencies = currenciesMap;

// TODO mock PER URL

export const mockGET = (uri: string): Object | Array<Object> => {
  switch (uri) {
    case '/accounts':
      return denormalize(
        Object.keys(mockEntities.accounts),
        apiSpec.accounts.responseSchema,
        mockEntities
      );
    case '/dashboard':
      return denormalize(
        {
          lastOperations: Object.keys(mockEntities.operations).slice(0, 6)
        },
        apiSpec.dashboard.responseSchema,
        mockEntities
      );
  }
  throw new Error('mock does not implement uri=' + uri);
};

/*
const apiMocks = {
  accounts: Object.keys(mockEntities.accounts),
  dashboard: {
    lastOperations: Object.keys(mockEntities.operations).slice(0, 6)
  }
};

const data = {};
Object.keys(apiMocks).map(k => {
  data[k] = (params: *) => {
    const mock = apiMocks[k];
    return denormalize(
      typeof mock === 'function' ? mock(params) : mock,
      apiSpec[k].responseSchema,
      mockEntities
    );
  };
});

export default data;
*/
