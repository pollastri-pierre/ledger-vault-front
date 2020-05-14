// @flow
import { BigNumber } from "bignumber.js";
import type { Account, TransactionCreationNote } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";
import type { FeesLevel } from "bridge/fees.types";

export type EditProps<Transaction> = {|
  account: Account,
  transaction: Transaction,
  onChangeTransaction: Transaction => void,
  bridge: WalletBridge<Transaction>,
|};

export interface WalletBridge<Transaction> {
  FeesField: React$ComponentType<EditProps<Transaction>>;
  ExtraFields?: React$ComponentType<EditProps<Transaction>>;

  createTransaction(account: Account): Transaction;

  editTransactionAmount(Transaction, BigNumber): Transaction;
  editTransactionFees(Account, Transaction, fees: any): Transaction;
  editTransactionFeesLevel(Transaction, feeLevel: FeesLevel): Transaction;
  editTransactionNote(Transaction, TransactionCreationNote): Transaction;
  editTransactionRecipient(Transaction, string): Transaction;

  getEstimatedFees(Transaction): BigNumber;
  getMaxAmount(Transaction): ?BigNumber;
  getTotalSpent(Account, Transaction): BigNumber;
  getTransactionError(Transaction): ?Error;
  getTransactionNote(transaction: Transaction): TransactionCreationNote;

  checkValidTransactionSync(
    account: Account,
    transaction: Transaction,
    parentAccount: ?Account,
  ): boolean;

  fetchRecipientError(
    restlay: RestlayEnvironment,
    currency: *,
    recipient: string,
    account?: Account,
  ): Promise<?Error>;
}
