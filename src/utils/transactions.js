// @flow
import type { Transaction, Account, User } from "data/types";
import { isAccountOutdated, isAccountBeingUpdated } from "utils/accounts";

export const hasPending = (account: Account, transactions: Transaction[]) =>
  transactions.filter(transaction => transaction.account_id === account.id)
    .length > 0;

// operation creation is not allowed if there is no accounts obviously.
// If there are accounts, we need at least one account with 0 pending operation and uptodate
// We need at leat one account with a balance > 0, and without pending
export const isCreateTransactionEnabled = (
  accounts: Account[],
  pendingTransactions: Transaction[],
) => {
  const filter = accounts.filter(
    account =>
      account.balance > 0 &&
      account.status === "APPROVED" &&
      !hasPending(account, pendingTransactions) &&
      !isAccountOutdated(account) &&
      !isAccountBeingUpdated(account),
  );
  return filter.length > 0;
};

export const getPendingsTransactions = (
  transactions: Transaction[],
): Transaction[] =>
  transactions.filter(transaction => transaction.status === "PENDING_APPROVAL");

export const isMemberOfAccount = (account: Account, me: User) => {
  const members = account.members.filter(
    member => member.pub_key === me.pub_key,
  );
  return members.length > 0;
};