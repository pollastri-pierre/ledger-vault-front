import reducer, * as module from '../../redux/modules/all-currencies';

describe('AllCurrencies module', () => {
  it('getCurrenciesStart() should return GET_CURRENCIES_START', () => {
    expect(module.getCurrenciesStart()).toEqual({
      type: module.GET_CURRENCIES_START,
    });
  });

  it('gotCurrencies() should return GOT_CURRENCIES and the currencies', () => {
    expect(module.gotCurrencies([])).toEqual({
      type: module.GOT_CURRENCIES,
      currencies: [],
    });
  });

  // testing reducer 
  //

  it('should set loading to true', () => {
    expect(reducer(module.initialState, { type: module.GET_CURRENCIES_START })).toEqual({
      ...module.initialState, isLoading: true,
    });
  });

  it('should set loading to false and set the currencies', () => {
    const state = { ...module.initialState, isLoading: true };
    expect(reducer(state, { type: module.GOT_CURRENCIES, currencies: [] })).toEqual({
      ...module.initialState, isLoading: false, currencies: [],
    });
  });
});

