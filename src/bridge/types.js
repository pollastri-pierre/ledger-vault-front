// @flow
import { BigNumber } from "bignumber.js";
import type { Account, TransactionCreationNote } from "data/types";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import type { RestlayEnvironment } from "restlay/connectData";

export type EditProps<Transaction> = {
  account: Account,
  transaction: Transaction,
  onChangeTransaction: Transaction => void,
  bridge: WalletBridge<Transaction>,
};

export interface WalletBridge<Transaction> {
  createTransaction(account: Account): Transaction;

  editTransactionAmount(
    account: Account,
    transaction: Transaction,
    amount: BigNumber,
  ): Transaction;

  getTransactionAmount(account: Account, transaction: Transaction): BigNumber;

  editTransactionRecipient(
    account: Account,
    transaction: Transaction,
    recipient: string,
  ): Transaction;

  getTransactionRecipient(account: Account, transaction: Transaction): string;
  getFees(account: Account, transaction: Transaction): ?BigNumber;
  getMaxAmount?: (account: Account, transaction: Transaction) => ?BigNumber;
  getTotalSpent(account: Account, transaction: Transaction): BigNumber;

  editTransactionNote(
    transaction: Transaction,
    note: TransactionCreationNote,
  ): Transaction;
  getTransactionNote(transaction: Transaction): TransactionCreationNote;

  getTransactionFeeLevel?: (
    account: Account,
    transaction: Transaction,
  ) => Speed;
  editTransactionFeeLevel?: (
    account: Account,
    transaction: Transaction,
    feeLevel: Speed,
  ) => Transaction;
  getRecipientWarning?: (recipient: string) => Promise<?Error>;
  getRecipientError: (
    restlay: RestlayEnvironment,
    currency: *,
    recipient: string,
  ) => Promise<?Error>;

  EditFees?: *; // React$ComponentType<EditProps<Transaction>>;

  EditAdvancedOptions?: *; // React$ComponentType<EditProps<Transaction>>;

  checkValidTransactionSyncSync(
    account: Account,
    transaction: Transaction,
    parentAccount: ?Account,
  ): boolean;
}
