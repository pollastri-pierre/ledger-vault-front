//@flow
import { denormalize } from 'normalizr';
import apiSpec from './api-spec';
import mockEntities from './mock-entities.js';

console.log('MOCK', mockEntities);

const mockGETSync = (uri: string) => {
  switch (uri) {
    case '/members':
      return denormalize(
        Object.keys(mockEntities.members),
        apiSpec.members.responseSchema,
        mockEntities
      );
    case '/accounts':
      return denormalize(
        Object.keys(mockEntities.accounts),
        apiSpec.accounts.responseSchema,
        mockEntities
      );
    case '/dashboard':
      return denormalize(
        {
          lastOperations: Object.keys(mockEntities.operations).slice(0, 6),
          pending: {
            operations: Object.keys(mockEntities.operations).slice(6, 9),
            accounts: Object.keys(mockEntities.accounts).slice(1, 3),
            total: 7,
            totalAccounts: 3,
            totalOperations: 4
          }
        },
        apiSpec.dashboard.responseSchema,
        mockEntities
      );
  }
  throw new Error('mock does not implement uri=' + uri);
};

const delay = ms => new Promise(success => setTimeout(success, ms));

export const mockGET = (uri: string): Promise<*> =>
  delay(400 + 400 * Math.random()).then(() => mockGETSync(uri));
