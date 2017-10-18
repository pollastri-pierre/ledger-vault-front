export const GET_CURRENCIES_START = 'currencies/GET_CURRENCIES_START';
export const GOT_CURRENCIES = 'currencies/GOT_CURRENCIES';

export const initialState = {
  currencies: null,
  isLoading: false,
};

export function getCurrenciesStart() {
  return {
    type: GET_CURRENCIES_START,
  };
}
export function gotCurrencies(currencies) {
  return {
    type: GOT_CURRENCIES,
    currencies,
  };
}

export function getCurrencies() {
  return (dispatch) => {
    dispatch(getCurrenciesStart());

    setTimeout(() => {
      const currencies = [
        {
          family: 'Bitcoin',
          units: [{
            name: 'bitcoin',
            code: 'BTC',
            symbol: 'BTC',
            magnitude: 2,
          }],
        },
        {
          family: 'Dogecoin',
          units: [{
            name: 'dogecoin',
            code: 'DOGE',
            symbol: 'DOGE',
            magnitude: 2,
          }],
        },
        {
          family: 'Dash',
          units: [{
            name: 'dash',
            code: 'DASH',
            symbol: 'DASH',
            magnitude: 2,
          }],
        },
        {
          family: 'Ethereum',
          units: [{
            name: 'Ethereum',
            code: 'ETH',
            symbol: 'ETH',
            magnitude: 2,
          }],
        },
        {
          family: 'Ethereum',
          units: [{
            name: 'Ethereum Classic',
            code: 'ETH',
            symbol: 'ETH',
            magnitude: 2,
          }],
        },
        {
          family: 'Litecoin',
          units: [{
            name: 'Litecoin',
            code: 'LTC',
            symbol: 'LTC',
            magnitude: 2,
          }],
        },
      ];
      dispatch(gotCurrencies(currencies));
    }, 1000);
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_CURRENCIES_START:
      return { ...state, isLoading: true };
    case GOT_CURRENCIES:
      return { ...state, isLoading: false, currencies: action.currencies };
    default:
      return state;
  }
}
