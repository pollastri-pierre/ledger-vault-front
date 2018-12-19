// @flow
import type { Account } from "data/types";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";

export type EditProps<Transaction> = {
  account: Account,
  value: Transaction,
  onChange: Transaction => void,
  bridge: WalletBridge<Transaction>
}

export interface WalletBridge<Transaction> {
  // isRecipientValid(currency: Currency, recipient: string): Promise<boolean>;
  // getRecipientWarning(currency: Currency, recipient: string): Promise<?Error>;

  createTransaction(account: Account): Transaction;

  editTransactionAmount(
    account: Account,
    transaction: Transaction,
    amount: number
  ): Transaction;

  getTransactionAmount(account: Account, transaction: Transaction): number;

  editTransactionRecipient(
    account: Account,
    transaction: Transaction,
    recipient: string
  ): Transaction;

  getTransactionRecipient(account: Account, transaction: Transaction): string;
  getTotalSpent(account: Account, transaction: Transaction): Promise<number>;

  editTransactionLabel(
    account: Account,
    transaction: Transaction,
    label: string
  ): Transaction;
  getTransactionLabel(account: Account, transaction: Transaction): string;

  editTransactionNote(
    account: Account,
    transaction: Transaction,
    note: string
  ): Transaction;
  getTransactionNote(account: Account, transaction: Transaction): string;

  getTransactionFeeLevel?: (account: Account, transaction: Transaction) => Speed;
  editTransactionFeeLevel?: (account: Account, transaction: Transaction, feeLevel: Speed) => Transaction;

  EditFees?: *; // React$ComponentType<EditProps<Transaction>>;

  EditAdvancedOptions?: *; // React$ComponentType<EditProps<Transaction>>;

  isRecipientValid(restlay: *, currency: *, recipient: string): Promise<boolean>;

  checkValidTransaction(
    account: Account,
    transaction: Transaction
  ): Promise<boolean>;
}
