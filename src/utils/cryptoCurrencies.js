// @flow
import memoize from "lodash/memoize";
import { listCryptoCurrencies as listCC } from "@ledgerhq/live-common/lib/helpers/currencies";
import type { CryptoCurrencyIds } from "@ledgerhq/live-common/lib/types";

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
  "bitcoin_testnet"
];

export const listCryptoCurrencies = memoize((withDevCrypto?: boolean) =>
  listCC(withDevCrypto)
    .filter(c => supported.includes(c.id))
    .sort((a, b) => a.name.localeCompare(b.name))
);
