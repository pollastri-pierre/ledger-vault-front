// @flow
import type { Transaction, Account } from "data/types";
import { isAccountOutdated, isAccountBeingUpdated } from "utils/accounts";
import { isMemberOfFirstApprovalStep } from "utils/users";

export const hasPending = (account: Account, transactions: Transaction[]) =>
  transactions.filter(
    (transaction) =>
      transaction.status === "PENDING_APPROVAL" &&
      transaction.account_id === account.id,
  ).length > 0;

// transaction creation is not allowed if there is no accounts obviously.
// If there are accounts, we need at least one account with 0 pending operation and uptodate
// Operator has to be part of the first step of approval flow
// We need at leat one account with a balance > 0, and without pending
export const isAccountNotSpendableWithReason = (account: Account): string[] => {
  const reasons = [
    !account.balance.isGreaterThan(0) && "reasons:account.balance0",
    account.status !== "ACTIVE" && "reasons:account.not_active",
    isAccountOutdated(account) && "reasons:account.outdated",
    !isMemberOfFirstApprovalStep(account) &&
      "reasons:account.not_in_first_step",
    isAccountBeingUpdated(account) && "reasons:account.updating",
  ];

  // $FlowFixMe: I know if I remove `false` I will only get strings in the array
  return reasons.filter((r) => !!r);
};

export const isAccountSpendable = (account: Account) => {
  return isAccountNotSpendableWithReason(account).length === 0;
};

export const isCreateTransactionEnabled = (accounts: Account[]) => {
  const filter = accounts.filter((account) => isAccountSpendable(account));
  return filter.length > 0;
};

export const getPendingsTransactions = (
  transactions: Transaction[],
): Transaction[] =>
  transactions.filter(
    (transaction) => transaction.status === "PENDING_APPROVAL",
  );
