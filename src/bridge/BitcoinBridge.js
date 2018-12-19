// @flow
import React from "react";
import ValidateAddressQuery from "api/queries/ValidateAddressQuery";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import type { WalletBridge, EditProps } from "./types";
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

const EditFees = ({ account, onChange, value }: EditProps<Transaction>) => (
  <FeesBitcoinKind
    onChange={onChange}
    transaction={value}
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
    note: "",
  }),
  // convert to Big Number
  getTotalSpent: (a, t) =>
    t.amount == 0
      ? Promise.resolve(0)
      : Promise.resolve(t.amount + t.estimatedFees),

  editTransactionAmount: (account: *, t: Transaction, amount: number) => {
    return {
      ...t,
      amount
    };
  },

  getTransactionAmount: (a: *, t: Transaction) => t.amount,

  editTransactionRecipient: (
    account: *,
    t: Transaction,
    recipient: string
  ) => ({
    ...t,
    recipient
  }),

  getTransactionRecipient: (a: *, t: Transaction) => t.recipient,
  getRecipientWarning: () => Promise.resolve(null),

  getTransactionFeeLevel: (a: *, t: Transaction) => t.feeLevel,
  editTransactionFeeLevel: (account: *, t: Transaction, feeLevel: string) => ({
    ...t,
    feeLevel
  }),

  getTransactionLabel: (a: *, t: Transaction) => t.label,
  editTransactionLabel: (account: *, t: Transaction, label: string) => ({
    ...t,
    label
  }),
  getTransactionNote: (a: *, t: Transaction) => t.note,
  editTransactionNote : (account: *, t: Transaction, note: string) => ({
    ...t,
    note
  }),
  EditFees,
  checkValidTransaction,
  isRecipientValid
};

export default BitcoinBridge;
