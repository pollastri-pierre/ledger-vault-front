// @flow

import memoize from "lodash/memoize";
import sortBy from "lodash/sortBy";
import { listCryptoCurrencies as listCC } from "@ledgerhq/live-common/lib/helpers/currencies";
import type { CryptoCurrencyIds } from "@ledgerhq/live-common/lib/types";

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
  "ethereum"
];

export const listCryptoCurrencies = memoize((withDevCrypto?: boolean) =>
  listCC(withDevCrypto)
    .filter(c => supported.includes(c.id))
    .sort((a, b) => a.name.localeCompare(b.name))
);

export const listERC20Tokens = memoize(
  (): ERC20Token[] => sortBy(rawERC20List, "name")
);
