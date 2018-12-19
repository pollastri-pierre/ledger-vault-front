// @flow
import React from "react";
import ValidateAddressQuery from "api/queries/ValidateAddressQuery";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import NewOperationMutation from "api/mutations/NewOperationMutation";
import type { WalletBridge, EditProps } from "./types";
import type { Account } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";
import FeesBitcoinKind from "components/FeesField/BitcoinKind";

//convertion to the BigNumber needed
type Transaction = {
  amount: number,
  recipient: string,
  estimatedFees: *,
  feeLevel: Speed,
  label: string,
  note: string
};

const EditFees = ({
  account,
  onChangeTransaction,
  transaction
}: EditProps<Transaction>) => (
  <FeesBitcoinKind
    onChangeTransaction={onChangeTransaction}
    transaction={transaction}
    account={account}
    bridge={BitcoinBridge}
  />
);

const checkValidTransaction = () => {
  return Promise.resolve(true);
};

const isRecipientValid = (restlay, currency, recipient) => {
  if (recipient) {
    return restlay
      .fetchQuery(new ValidateAddressQuery({ currency, address: recipient }))
      .then(r => {
        return Promise.resolve(r.is_valid);
      });
  } else {
    return Promise.resolve(false);
  }
};

const BitcoinBridge: WalletBridge<Transaction> = {
  createTransaction: () => ({
    amount: 0,
    recipient: "",
    estimatedFees: null,
    feeLevel: "normal",
    label: "",
    note: ""
  }),
  // convert to Big Number
  getTotalSpent: (a, t) =>
    t.amount == 0
      ? Promise.resolve(0)
      : Promise.resolve(t.amount + t.estimatedFees),

  editTransactionAmount: (account: Account, t: Transaction, amount: number) => {
    return {
      ...t,
      amount
    };
  },

  getTransactionAmount: (a: Account, t: Transaction) => t.amount,

  editTransactionRecipient: (
    account: Account,
    t: Transaction,
    recipient: string
  ) => ({
    ...t,
    recipient
  }),

  getTransactionRecipient: (a: Account, t: Transaction) => t.recipient,
  getRecipientWarning: () => Promise.resolve(null),

  getTransactionFeeLevel: (a: Account, t: Transaction) => t.feeLevel,
  editTransactionFeeLevel: (
    account: Account,
    t: Transaction,
    feeLevel: string
  ) => ({
    ...t,
    feeLevel
  }),

  getTransactionLabel: (a: Account, t: Transaction) => t.label,
  editTransactionLabel: (account: Account, t: Transaction, label: string) => ({
    ...t,
    label
  }),
  getTransactionNote: (a: Account, t: Transaction) => t.note,
  editTransactionNote: (account: Account, t: Transaction, note: string) => ({
    ...t,
    note
  }),
  composeAndBroadcast: (
    operation_id: number,
    restlay: RestlayEnvironment,
    account: Account,
    transaction: Transaction
  ) => {
    const data: * = {
      operation: {
        fee_level: transaction.feeLevel,
        amount: transaction.amount,
        recipient: transaction.recipient,
        operation_id: operation_id,
        note: {
          title: transaction.label,
          content: transaction.note
        }
      },
      accountId: account.id
    };
    return restlay
      .commitMutation(new NewOperationMutation(data))
      .then(() => restlay.fetchQuery(new PendingOperationsQuery()));
  },
  EditFees,
  checkValidTransaction,
  isRecipientValid
};

export default BitcoinBridge;
