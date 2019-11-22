// @flow

import memoize from "lodash/memoize";
import keyBy from "lodash/keyBy";
import sortBy from "lodash/sortBy";
import { listCryptoCurrencies as listCC } from "@ledgerhq/live-common/lib/currencies";
import type {
  CryptoCurrencyIds,
  CryptoCurrency,
} from "@ledgerhq/live-common/lib/types";
import { getCryptoCurrencyIcon as getIcon } from "@ledgerhq/live-common/lib/react";

import type { ERC20Token, CurrencyOrToken } from "data/types";

const rawERC20List =
  window.config.ERC20_LIST === "dev"
    ? require("data/erc20-list.dev.json")
    : require("data/erc20-list.json");

const supported: CryptoCurrencyIds[] = [
  "bitcoin",
  "bitcoin_cash",
  "litecoin",
  "dash",
  "bitcoin_gold",
  "dogecoin",
  "digibyte",
  "komodo",
  "pivx",
  "ripple",
  "vertcoin",
  "viacoin",
  "bitcoin_testnet",
  "ethereum",
  "ethereum_ropsten",
];

const notSupportedCoin: CryptoCurrencyIds[] = ["komodo"];

export const currencyOrNull = (
  currencyOrToken: CurrencyOrToken,
): CryptoCurrency | null => {
  // $FlowFixMe
  if (currencyOrToken.contract_address) return null;
  // $FlowFixMe
  const currency: CryptoCurrency = currencyOrToken;
  return currency;
};

export const tokenOrNull = (
  currencyOrToken: CurrencyOrToken,
): ERC20Token | null => {
  // $FlowFixMe
  if (!currencyOrToken.contract_address) return null;
  // $FlowFixMe
  const token: ERC20Token = currencyOrToken;
  return token;
};

export const getCurrencyLikeUnit = (token: ?ERC20Token) => ({
  code: token ? token.ticker : "",
  symbol: "",
  magnitude: token ? token.decimals : 0,
  name: "",
});

export const isNotSupportedCoin: CryptoCurrency => boolean = memoize(
  (cur: CryptoCurrency) => notSupportedCoin.indexOf(cur.id) > -1,
);

export const listCryptoCurrencies: boolean => CryptoCurrency[] = memoize(
  (withDevCrypto?: boolean) => {
    const list = listCC(withDevCrypto)
      .filter(c => supported.includes(c.id))
      .sort((a, b) => a.name.localeCompare(b.name));
    return list;
  },
);

export const listERC20Tokens: () => ERC20Token[] = memoize((): ERC20Token[] =>
  sortBy(
    rawERC20List.filter(t => t.hsm_signature || t.hsm_account_parameters),
    "name",
  ),
);

export const isERC20Token = (v: ?ERC20Token | ?CryptoCurrency) =>
  !!v && "contract_address" in v;

// the John's list gives us the blockchan_name with foundation for mainet and ropstem for testnet
// but the gate is expecting ethereum and ethereum_ropsten
const currencyIdByBlockchainName = {
  foundation: "ethereum",
  ropsten: "ethereum_ropsten",
};
export const getCurrencyIdFromBlockchainName = (blockchain: string) =>
  currencyIdByBlockchainName[blockchain]
    ? currencyIdByBlockchainName[blockchain]
    : blockchain;

export const getCryptoCurrencyIcon = (currency: CryptoCurrency) =>
  getIcon(currency);

const erc20TokensByContractAddress = keyBy(rawERC20List, "contract_address");

export const getERC20TokenByContractAddress = (
  contractAddress: string,
): ?ERC20Token => erc20TokensByContractAddress[contractAddress] || null;
