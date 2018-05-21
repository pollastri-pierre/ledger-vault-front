//@flow
import type { Operation, Account } from "data/types";

// operation creation is not allowed if there is no accounts obviously.
// If there are accounts, we need at least one account with 0 pending operation
// We need at leat one account with a balance > 0, and without pending

export const isCreateOperationEnabled = (
  accounts: Account[],
  pendingOperations: Operation[]
) => {
  const filter = accounts.filter(
    account => account.balance > 0 && !hasPending(account, pendingOperations)
  );
  return filter.length > 0;
};

export const getPendingsOperations = (operations: Operation[]) =>
  operations.filter(operation => operation.status === "PENDING_APPROVAL");

export const hasPending = (account: Account, operations: Operation[]) =>
  operations.filter(operation => operation.account_id === account.id).length >
  0;
