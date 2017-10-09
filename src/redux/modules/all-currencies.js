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
          name: 'Bitcoin',
          shortname: 'BTC',
        },
        {
          name: 'Dogecoin',
          shortname: 'DOGE',
        },
        {
          name: 'Dash',
          shortname: 'DASH',
        },
        {
          name: 'Ethereum',
          shortname: 'ETH',
        },
        {
          name: 'Ethereum Classic',
          shortname: 'ETC',
        },
        {
          name: 'Litecoin',
          shortname: 'LTC',
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
