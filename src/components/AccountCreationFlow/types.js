// @flow

import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import type { Connection } from "restlay/ConnectionQuery";
import type { ERC20Token, Account, User, Group } from "data/types";
import type { ApprovalsRule } from "components/ApprovalsRules";
import type { StepProps } from "components/base/MultiStepsFlow/types";

export type ParentAccount = { id: number } | { name: string };

export type AccountCreationPayload = {
  name: string,
  rules: ApprovalsRule[],
  currency: CryptoCurrency | null,
  erc20token: ERC20Token | null,
  parentAccount: ParentAccount | null,
};

export type AccountCreationUpdatePayload = (
  $Shape<AccountCreationPayload>,
) => void;

type GenericStepProps = StepProps<AccountCreationPayload>;

export type AccountCreationStepProps = GenericStepProps & {
  allAccounts: Account[],
  users: Connection<User>,
  groups: Group[],
};
