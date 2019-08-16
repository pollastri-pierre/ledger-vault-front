// @flow
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import BitcoinBridge from "./BitcoinBridge";
import EthereumBridge from "./EthereumBridge";
import RippleBridge from "./RippleBridge";
import type { WalletBridge } from "./types";

const perFamily = {
  bitcoin: BitcoinBridge,
  ethereum: EthereumBridge,
  ripple: RippleBridge,
};

export const getBridgeForCurrency = (
  currency: CryptoCurrency,
): WalletBridge<*> => {
  const bridge = perFamily[currency.family.toLowerCase()];
  return bridge;
};
