// @flow
import type { Currency } from "@ledgerhq/live-common/lib/types";

export type SetExchangePairs = (
  Array<{
    from: Currency,
    to: Currency,
    exchange: string,
  }>,
) => *;

export const setExchangePairsAction: SetExchangePairs = pairs => ({
  type: "SETTINGS_SET_PAIRS",
  pairs,
});

type State = {
  pairs: *,
  data: { [_: string]: string },
};

export default function reducer(
  state: State = {
    pairs: [],
    data: {},
  },
  action: Object,
) {
  switch (action.type) {
    case "SETTINGS_SET_PAIRS": {
      const data = {};
      action.pairs.forEach(pair => {
        if (pair.to.ticker === "BTC") {
          data[pair.from.ticker] = pair.exchange;
        } else if (pair.from.ticker === "BTC" && pair.to.ticker === "USD") {
          data.USD = pair.exchange;
        }
      });
      return { ...state, pairs: action.pairs, data };
    }
    default:
      return state;
  }
}

export const currencyExchangeSelector = (
  state: *,
  currency: Currency,
): ?string => {
  // NOTE checking for null because there is a strange pair btc-to-btc generates which results in exchange - null
  const pair = state.exchanges.pairs.find(
    p => p.from.id === currency.id && p.exchange != null,
  );
  return (pair && pair.exchange) || null;
};
