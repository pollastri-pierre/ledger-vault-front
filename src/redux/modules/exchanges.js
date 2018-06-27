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
  pairs: *
};

export default function reducer(
  state: State = {
    pairs: []
  },
  action: Object
) {
  switch (action.type) {
    case "SETTINGS_SET_PAIRS":
      return { ...state, pairs: action.pairs };
    default:
      return state;
  }
}
