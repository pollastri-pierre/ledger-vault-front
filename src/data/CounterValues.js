import createCounterValues from "@ledgerhq/live-common/lib/countervalues";
import { createSelector } from "reselect";
import { getFiatCurrencyByTicker } from "@ledgerhq/live-common/lib/helpers/currencies";
import {
  listCryptoCurrencies,
  getCryptoCurrencyById
} from "utils/cryptoCurrencies";

import { setExchangePairsAction } from "redux/modules/exchanges";

const allCurrencies = listCryptoCurrencies(true);
const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const pairsSelector = createSelector(
  () => allCurrencies,
  currencies => {
    return [
      {
        from: intermediaryCurrency,
        to: getFiatCurrencyByTicker("USD")
      }
    ].concat(
      currencies.map(c => ({
        from: getCryptoCurrencyById(c.id),
        to: intermediaryCurrency
      }))
    );
  }
);

const CounterValues = createCounterValues({
  getAPIBaseURL: () => "https://countervalues.api.live.ledger.com",
  storeSelector: state => state.countervalues,
  pairsSelector,
  setExchangePairsAction
});

export default CounterValues;
