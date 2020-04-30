// @flow

import type { StepProps } from "components/base/MultiStepsFlow/types";
import type { Account, Whitelist } from "data/types";
import type { WalletBridge } from "bridge/types";
import type { Connection } from "restlay/ConnectionQuery";
import type { Transaction as BitcoinLikeTransaction } from "bridge/BitcoinBridge";
import type { Transaction as EthereumLikeTransaction } from "bridge/EthereumBridge";
import type { Transaction as RippleLikeTransaction } from "bridge/RippleBridge";

export type TransactionCreationPayload<Transaction> = {|
  account: ?Account,
  transaction: ?Transaction,
  bridge: ?WalletBridge<*>,
|};

export type TransactionCreationUpdatePayload<T> = (
  $Shape<TransactionCreationPayload<T>>,
) => void;

type GenericStepProps<T> = StepProps<TransactionCreationPayload<T>>;

export type TransactionCreationStepProps<T> = GenericStepProps<T> & {
  accounts: Connection<Account>,
  whitelists: Connection<Whitelist>,
};

/* eslint-disable flowtype/space-after-type-colon */
export type serializePayloadProps = {
  transaction:
    | ?BitcoinLikeTransaction
    | ?EthereumLikeTransaction
    | ?RippleLikeTransaction,
  account: ?Account,
};
