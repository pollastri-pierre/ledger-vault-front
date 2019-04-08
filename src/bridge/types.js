// @flow
import { BigNumber } from "bignumber.js";
import type { Account } from "data/types";
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
  getFees(account: Account, transaction: Transaction): Promise<BigNumber>;
  getTotalSpent(account: Account, transaction: Transaction): Promise<BigNumber>;

  editTransactionLabel(
    account: Account,
    transaction: Transaction,
    label: string,
  ): Transaction;
  getTransactionLabel(account: Account, transaction: Transaction): string;

  editTransactionNote(
    account: Account,
    transaction: Transaction,
    note: string,
  ): Transaction;
  getTransactionNote(account: Account, transaction: Transaction): string;

  composeAndBroadcast(
    operationId: number,
    restlay: RestlayEnvironment,
    account: Account,
    transaction: Transaction,
  ): Promise<*>;

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
  checkValidFee?: (
    account: Account,
    transaction: Transaction,
    parentETH: Account,
  ) => Promise<boolean>;
  EditFees?: *; // React$ComponentType<EditProps<Transaction>>;

  EditAdvancedOptions?: *; // React$ComponentType<EditProps<Transaction>>;

  isRecipientValid(
    restlay: RestlayEnvironment,
    currency: *,
    recipient: string,
  ): Promise<boolean>;

  checkValidTransaction(
    account: Account,
    transaction: Transaction,
    restlay: RestlayEnvironment,
  ): Promise<boolean>;
}
