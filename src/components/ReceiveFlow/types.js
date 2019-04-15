// @flow

import type { Connection } from "restlay/ConnectionQuery";
import type { Account } from "data/types";
import type { StepProps } from "components/base/MultiStepsFlow/types";

export type ReceiveFlowPayload = {
  selectedAccount: Account,
  isOnVaultApp: boolean,
  isAddressVerified: boolean,
};

export type ReceiveFlowUpdatePayload = ($Shape<ReceiveFlowPayload>) => void;

type GenericStepProps = StepProps<ReceiveFlowPayload>;

export type ReceiveFlowStepProps = GenericStepProps & {
  accounts: Connection<Account>,
};
