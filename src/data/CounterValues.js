import createCounterValues from "@ledgerhq/live-common/lib/countervalues";
import { createSelector } from "reselect";
import { currenciesSelector, accountsSelector } from "restlay/dataStore";
import { setExchangePairsAction } from "redux/modules/exchanges";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/helpers/currencies";
const allCurrencies = listCryptoCurrencies(true);

import { getFiatCurrencyByTicker } from "@ledgerhq/live-common/lib/helpers/currencies";

const pairsSelector = createSelector(
  currenciesSelector,
  accountsSelector,
  (currencies, accounts) => {
    return currencies
      .filter(
        currency =>
          accounts.findIndex(account => account.currency === currency.name) > -1
      )
      .map(currency => ({
        from: allCurrencies.find(curr => curr.id === currency.name),
        to: getFiatCurrencyByTicker("USD"),
        exchange: "Bitfinex"
      }));
  }
);

const CounterValues = createCounterValues({
  getAPIBaseURL: () => "https://countervalues.api.live.ledger.com",
  storeSelector: state => state.countervalues,
  pairsSelector,
  setExchangePairsAction
});

export default CounterValues;
