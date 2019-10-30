// @flow

import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import type { Connection } from "restlay/ConnectionQuery";
import type { ERC20Token, Account, User, Group, Whitelist } from "data/types";
import type { RulesSet } from "components/MultiRules/types";
import type { StepProps } from "components/base/MultiStepsFlow/types";

export type ParentAccount = { id: number } | { name: string };

export type AccountCreationPayload = {
  id?: number,
  name: string,
  accountStatus: string,
  rulesSets: RulesSet[],
  currency: CryptoCurrency | null,
  erc20token: ERC20Token | null,
  parentAccount: ParentAccount | null,
};

export type AccountCreationUpdatePayload = (
  $Shape<AccountCreationPayload>,
) => void;

type GenericStepProps = StepProps<AccountCreationPayload>;

export type AccountCreationStepProps = GenericStepProps & {
  account: Account,
  allAccounts: Connection<Account>,
  users: Connection<User>,
  groups: Connection<Group>,
  whitelists: Connection<Whitelist>,
};
