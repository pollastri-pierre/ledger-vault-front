// @flow

import memoize from "lodash/memoize";
import sortBy from "lodash/sortBy";
import {
  listCryptoCurrencies as listCC,
  getCryptoCurrencyById as getCrypto
} from "@ledgerhq/live-common/lib/helpers/currencies";
import type {
  CryptoCurrencyIds,
  CryptoCurrency
} from "@ledgerhq/live-common/lib/types";

import type { ERC20Token } from "data/types";
import rawERC20List from "data/erc20-list.json";

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
  "vertcoin",
  "viacoin",
  "bitcoin_testnet",
  "ethereum",
  "ethereum_testnet"
];

export const listCryptoCurrencies: boolean => CryptoCurrency[] = memoize(
  (withDevCrypto?: boolean) => {
    const list = listCC(withDevCrypto)
      .filter(c => supported.includes(c.id))
      .sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }
);

export const listERC20Tokens: () => ERC20Token[] = memoize(
  (): ERC20Token[] => sortBy(rawERC20List, "name")
);

export const isERC20Token = (v: ?ERC20Token | ?CryptoCurrency) => {
  return !!v && "contract_address" in v;
};

export const getCryptoCurrencyById = (id: string) =>
  id === "ethereum_ropsten" ? getCrypto("ethereum_testnet") : getCrypto(id);
