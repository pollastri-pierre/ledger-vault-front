import mockJSON from './mock.json';
import currencies from '../currencies';

// This initialize the initial entities (things like currencies are already available)
export default () => {
  const { entities } = mockJSON;
  const currenciesMap = {};
  currencies.forEach(c => {
    currenciesMap[c.name] = c;
  });
  return { entities: { ...entities, currencies: currenciesMap } };
};
