//@flow
import type { Currency } from "@ledgerhq/live-common/lib/types";

export type SetExchangePairs = (
  Array<{
    from: Currency,
    to: Currency,
    exchange: string
  }>
) => *;

export const setExchangePairsAction: SetExchangePairs = pairs => ({
  type: "SETTINGS_SET_PAIRS",
  pairs
});

type State = {
  pairs: *,
  data: { [_: string]: string }
};

export default function reducer(
  state: State = {
    pairs: [],
    data: {}
  },
  action: Object
) {
  switch (action.type) {
    case "SETTINGS_SET_PAIRS": {
      const data = {};
      action.pairs.map(pair => {
        data[pair.from.ticker] = pair.exchange;
      });
      return { ...state, pairs: action.pairs, data };
    }
    default:
      return state;
  }
}
