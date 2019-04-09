import axios from "axios";
import uniqBy from "lodash/uniqBy";
import createCounterValues from "@ledgerhq/live-common/lib/countervalues";
import { createSelector } from "reselect";
import {
  listCryptoCurrencies,
  getCryptoCurrencyById,
  getFiatCurrencyByTicker,
  getERC20TokenByContractAddress,
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
    ]
      .concat(
        allCurrencies
          .filter(
            currency =>
              accounts.findIndex(account => {
                if (
                  account.currency_id === "ethereum_ropsten" &&
                  currency.id === "ethereum"
                )
                  return true;
                return account.currency_id === currency.id;
              }) > -1 &&
              currency.name !== "bitcoin_testnet" &&
              currency.name !== "bitcoin",
          )
          .map(currency => ({
            from: allCurrencies.find(curr => curr.id === currency.id),
            to: intermediaryCurrency,
          })),
      )
      .concat(
        uniqBy(
          accounts
            .filter(a => a.account_type === "ERC20")
            .map(a => {
              const token = getERC20TokenByContractAddress(a.contract_address);
              if (!token) return null;
              return {
                from: { ticker: token.ticker },
                to: intermediaryCurrency,
              };
            })
            .filter(Boolean),
          "from.ticker",
        ),
      ),
);

setNetwork(axios);

const CounterValues = createCounterValues({
  log: (...args) => {
    if (process.env.DEBUG_COUNTERVALUES) {
      console.log("CounterValues:", ...args); // eslint-disable-line no-console
    }
  },
  getAPIBaseURL: () => "https://countervalues.api.live.ledger.com",
  storeSelector: state => state.countervalues,
  pairsSelector,
  setExchangePairsAction,
});

export default CounterValues;
