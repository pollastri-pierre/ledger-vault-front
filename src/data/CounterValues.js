import createCounterValues from "@ledgerhq/live-common/lib/countervalues";
import { createSelector } from "reselect";
import { getFiatCurrencyByTicker } from "@ledgerhq/live-common/lib/helpers/currencies";
import {
  listCryptoCurrencies,
  getCryptoCurrencyById
} from "utils/cryptoCurrencies";

import { currenciesSelector, accountsSelector } from "restlay/dataStore";
import { setExchangePairsAction } from "redux/modules/exchanges";

const allCurrencies = listCryptoCurrencies(true);
const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const pairsSelector = createSelector(
  currenciesSelector,
  accountsSelector,
  (currencies, accounts) => {
    return [
      {
        from: intermediaryCurrency,
        to: getFiatCurrencyByTicker("USD")
      }
    ].concat(
      currencies
        .filter(
          currency =>
            accounts.findIndex(account => account.currency === currency.name) >
              -1 &&
            currency.name !== "bitcoin_testnet" &&
            currency.name !== "ethereum_ropsten" &&
            currency.name !== "bitcoin"
        )
        .map(currency => ({
          from: allCurrencies.find(curr => curr.id === currency.name),
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
