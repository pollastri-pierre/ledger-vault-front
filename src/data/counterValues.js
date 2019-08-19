// @flow

import axios from "axios";
import uniqBy from "lodash/uniqBy";
import {
  implementCountervalues,
  getCountervalues,
} from "@ledgerhq/live-common/lib/countervalues";
import { createSelector } from "reselect";
import {
  listCryptoCurrencies,
  getCryptoCurrencyById,
  getFiatCurrencyByTicker,
} from "@ledgerhq/live-common/lib/currencies";
import { setNetwork } from "@ledgerhq/live-common/lib/network";

import type { Account } from "data/types";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import { accountsSelector } from "restlay/dataStore";
import { setExchangePairsAction } from "redux/modules/exchanges";

const allCurrencies = listCryptoCurrencies(true);
const intermediaryCurrency = getCryptoCurrencyById("bitcoin");

const pairsSelector = createSelector(
  accountsSelector,
  (accounts: Account[]) =>
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
      )
      .concat(
        uniqBy(
          accounts
            .filter(a => a.account_type === "ERC20")
            .map(a => {
              const token = getERC20TokenByContractAddress(a.contract_address);
              if (!token) return null;
              if (token.disable_countervalue) return null;
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

// $FlowFixMe
implementCountervalues({
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

const CounterValues = getCountervalues();

export default CounterValues;
