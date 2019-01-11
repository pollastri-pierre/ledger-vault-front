import createCounterValues from "@ledgerhq/live-common/lib/countervalues";
import { createSelector } from "reselect";
import { getFiatCurrencyByTicker } from "@ledgerhq/live-common/lib/helpers/currencies";
import {
  listCryptoCurrencies,
  getCryptoCurrencyById
} from "utils/cryptoCurrencies";

import { accountsSelector } from "restlay/dataStore";
import { setExchangePairsAction } from "redux/modules/exchanges";

const allCurrencies = listCryptoCurrencies(true);
const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const pairsSelector = createSelector(accountsSelector, accounts => {
  return [
    {
      from: intermediaryCurrency,
      to: getFiatCurrencyByTicker("USD")
    }
  ].concat(
    allCurrencies
      .filter(
        currency =>
          accounts.findIndex(account => account.currency_id === currency.id) >
            -1 &&
          currency.name !== "bitcoin_testnet" &&
          currency.name !== "bitcoin"
      )
      .map(currency => {
        return {
          from: allCurrencies.find(curr => curr.id === currency.id),
          to: intermediaryCurrency
        };
      })
  );
});

const CounterValues = createCounterValues({
  getAPIBaseURL: () => "https://countervalues.api.live.ledger.com",
  storeSelector: state => state.countervalues,
  pairsSelector,
  setExchangePairsAction
});

export default CounterValues;
