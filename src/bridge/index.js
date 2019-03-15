// @flow
import type { Currency } from "@ledgerhq/live-common/lib/types";
import BitcoinBridge from "./BitcoinBridge";
import EthereumBridge from "./EthereumBridge";
import type { WalletBridge } from "./types";

const perFamily = {
  bitcoin: BitcoinBridge,
  ethereum: EthereumBridge,
  ripple: null,
};

export const getBridgeForCurrency = (currency: Currency): WalletBridge<*> => {
  const bridge = perFamily[currency.family.toLowerCase()];
  return bridge;
};
