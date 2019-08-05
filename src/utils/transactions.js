// @flow
import type {
  Transaction,
  TransactionGetFees,
  Account,
  User,
} from "data/types";
import { isAccountOutdated, isAccountBeingUpdated } from "utils/accounts";
import { isMemberOfFirstApprovalStep } from "utils/users";
import AccountCalculateFeeQuery from "api/queries/AccountCalculateFeeQuery";
import type { RestlayEnvironment } from "restlay/connectData";

export const hasPending = (account: Account, transactions: Transaction[]) =>
  transactions.filter(transaction => transaction.account_id === account.id)
    .length > 0;

// transaction creation is not allowed if there is no accounts obviously.
// If there are accounts, we need at least one account with 0 pending operation and uptodate
// Operator has to be part of the first step of approval flow
// We need at leat one account with a balance > 0, and without pending
export const isAccountSpendable = (account: Account) =>
  account.balance.isGreaterThan(0) &&
  account.status === "ACTIVE" &&
  !isAccountOutdated(account) &&
  isMemberOfFirstApprovalStep(account) &&
  !isAccountBeingUpdated(account);

export const isCreateTransactionEnabled = (
  accounts: Account[],
  pendingTransactions: Transaction[],
) => {
  const filter = accounts.filter(
    account =>
      isAccountSpendable(account) && !hasPending(account, pendingTransactions),
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

export const getFees = async (
  account: Account,
  txGetFees: TransactionGetFees,
  restlay: RestlayEnvironment,
) => {
  const query = new AccountCalculateFeeQuery({
    accountId: account.id,
    txGetFees,
  });
  return restlay.fetchQuery(query);
};
