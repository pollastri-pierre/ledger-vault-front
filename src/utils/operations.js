//@flow
import type { Operation, Account, Member } from "data/types";
import { isAccountOutdated } from "utils/accounts";

// operation creation is not allowed if there is no accounts obviously.
// If there are accounts, we need at least one account with 0 pending operation and uptodate
// We need at leat one account with a balance > 0, and without pending

export const isCreateOperationEnabled = (
  accounts: Account[],
  pendingOperations: Operation[]
) => {
  const filter = accounts.filter(
    account =>
      account.balance > 0 &&
      !hasPending(account, pendingOperations) &&
      !isAccountOutdated(account)
  );
  return filter.length > 0;
};

export const getPendingsOperations = (operations: Operation[]) =>
  operations.filter(operation => operation.status === "PENDING_APPROVAL");

export const hasPending = (account: Account, operations: Operation[]) =>
  operations.filter(operation => operation.account_id === account.id).length >
  0;

export const isMemberOfAccount = (account: Account, me: Member) => {
  const members = account.members.filter(
    member => member.pub_key === me.pub_key
  );
  return members.length > 0;
};
