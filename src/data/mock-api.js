//@flow
import { denormalize } from 'normalizr';
import apiSpec from './api-spec';
import currencies from '../currencies';
import mockEntitiesJSON from './mock-entities.json';
const mockEntities = { ...mockEntitiesJSON };
const currenciesMap = {};
currencies.forEach(c => {
  currenciesMap[c.name] = c;
});
mockEntities.currencies = currenciesMap;

const apiMocks = {
  accounts: _ => Object.keys(mockEntities.accounts)
};

const data = {};
Object.keys(apiMocks).map(k => {
  data[k] = (params: *) =>
    denormalize(apiMocks[k](params), apiSpec[k].responseSchema, mockEntities);
});

export default data;
