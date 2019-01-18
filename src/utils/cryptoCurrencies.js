// @flow

import memoize from "lodash/memoize";
import keyBy from "lodash/keyBy";
import sortBy from "lodash/sortBy";
import {
  listCryptoCurrencies as listCC,
  getCryptoCurrencyById as getCrypto
} from "@ledgerhq/live-common/lib/helpers/currencies";
import type {
  CryptoCurrencyIds,
  CryptoCurrency
} from "@ledgerhq/live-common/lib/types";
import { getCryptoCurrencyIcon as getIcon } from "@ledgerhq/live-common/lib/react";

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
    // replacing ethereum_testnet by ethereum_ropsten
    // FIXME remove this hack when ledger-live-common is up to date with right currency id for eth ropsten
    const eth = list.find(c => c.id === "ethereum_testnet");
    if (eth) {
      eth.id = "ethereum_ropsten";
      eth.name = "Ethereum Ropsten";
      eth.scheme = "ethereum_ropsten";
    }
    return list;
  }
);

export const listERC20Tokens: () => ERC20Token[] = memoize(
  (): ERC20Token[] => sortBy(rawERC20List, "name")
);

export const isERC20Token = (v: ?ERC20Token | ?CryptoCurrency) =>
  !!v && "contract_address" in v;

export const getCryptoCurrencyById = (id: string) =>
  id === "ethereum_ropsten" ? getCrypto("ethereum_testnet") : getCrypto(id);

export const getCryptoCurrencyIcon = (currency: CryptoCurrency) =>
  currency.id === "ethereum_ropsten"
    ? getIcon({ ...currency, id: "ethereum_testnet" })
    : getIcon(currency);

const erc20TokensByContractAddress = keyBy(rawERC20List, "contract_address");

export const getERC20TokenByContractAddress = (
  contractAddress: string
): ?ERC20Token => erc20TokensByContractAddress[contractAddress] || null;
