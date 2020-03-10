// @flow

import type { StepProps } from "components/base/MultiStepsFlow/types";
import type { WalletBridge } from "bridge/types";
import type { Transaction as BitcoinLikeTx } from "bridge/BitcoinBridge";
import type { Account, AddressDaemon, UTXO } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";
import type { RestlayEnvironment } from "restlay/connectData";

export type ConsolidateUTXOPayload = {|
  transaction: BitcoinLikeTx,
  hasValidatedAddress: boolean,
|};

type GenericStepProps = StepProps<ConsolidateUTXOPayload>;

export type ConsolidateUTXOStepProps = GenericStepProps & {
  account: Account,
  bridge: WalletBridge<BitcoinLikeTx>,
  freshAddress: AddressDaemon,
  accountUTXOs: Connection<UTXO>,
  restlay: RestlayEnvironment,
};
