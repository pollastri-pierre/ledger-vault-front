import axios from "axios";
import createCounterValues from "@ledgerhq/live-common/lib/countervalues";
import { createSelector } from "reselect";
import {
  listCryptoCurrencies,
  getCryptoCurrencyById,
  getFiatCurrencyByTicker,
} from "@ledgerhq/live-common/lib/currencies";
import { setNetwork } from "@ledgerhq/live-common/lib/network";

import { accountsSelector } from "restlay/dataStore";
import { setExchangePairsAction } from "redux/modules/exchanges";

const allCurrencies = listCryptoCurrencies(true);
const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const pairsSelector = createSelector(
  accountsSelector,
  accounts =>
    [
      {
        from: intermediaryCurrency,
        to: getFiatCurrencyByTicker("USD"),
      },
    ].concat(
      allCurrencies
        .filter(
          currency =>
            accounts.findIndex(account => {
              if (
                account.currency === "ethereum_ropsten" &&
                currency.id === "ethereum"
              )
                return true;
              return account.currency === currency.id;
            }) > -1 &&
            currency.name !== "bitcoin_testnet" &&
            currency.name !== "bitcoin",
        )
        .map(currency => ({
          from: allCurrencies.find(curr => curr.id === currency.id),
          to: intermediaryCurrency,
        })),
    ),
);

setNetwork(axios);

const CounterValues = createCounterValues({
  log: (...args) => console.log("CounterValues:", ...args), // eslint-disable-line no-console
  getAPIBaseURL: () => "https://countervalues.api.live.ledger.com",
  storeSelector: state => state.countervalues,
  pairsSelector,
  setExchangePairsAction,
});

export default CounterValues;
