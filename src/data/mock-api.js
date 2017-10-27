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

const delay = ms => new Promise(success => setTimeout(success, ms));

// TODO mock PER URL

const mockGETSync = (uri: string) => {
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

export const mockGET = (uri: string): Promise<*> =>
  delay(400 + 400 * Math.random()).then(() => mockGETSync(uri));
