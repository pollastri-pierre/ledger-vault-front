// @flow
import React from "react";
import type { WalletBridge } from "./types";

//convertion to the BigNumber needed
type Transaction = {
  recipient: string,
  amount: number,
  gasPrice: ?number,
  gasLimit: number,
  label: string,
  note: string
};

const EditFees = () => <div>Edit Fees div eth bridge</div>;

const EditAdvancedOptions = () => <div>Placeholder for Advanced Options </div>;

const isRecipientValid = () => {
  return Promise.resolve(true);
};

const checkValidTransaction = () => {
  return Promise.resolve(true);
};

const EthereumBridge: WalletBridge<Transaction> = {
  createTransaction: () => ({
    amount: 0,
    recipient: "",
    gasPrice: null,
    gasLimit: 0,
    label: "",
    note: ""
  }),

  // convert to Big Number and update the computation
  getTotalSpent: (a, t) =>
    t.amount == 0 ? Promise.resolve(0) : Promise.resolve(t.amount),

  editTransactionAmount: (account: *, t: *, amount: *) => {
    return {
      ...t,
      amount
    };
  },

  getTransactionAmount: (a: *, t: *) => t.amount,

  editTransactionRecipient: (account: *, t: *, recipient: *) => ({
    ...t,
    recipient
  }),

  getTransactionRecipient: (a: *, t: *) => t.recipient,
  getRecipientWarning: () => Promise.resolve(null),

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
  EditAdvancedOptions,
  checkValidTransaction,
  isRecipientValid
};

export default EthereumBridge;
