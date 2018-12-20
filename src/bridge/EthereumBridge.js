// @flow
import React from "react";
import type { WalletBridge } from "./types";
import type { Account } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";

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

  editTransactionAmount: (account: Account, t: Transaction, amount: number) => {
    return {
      ...t,
      amount
    };
  },

  getTransactionAmount: (a: Account, t: Transaction) => t.amount,

  editTransactionRecipient: (account: Account, t: Transaction, recipient: string) => ({
    ...t,
    recipient
  }),

  getTransactionRecipient: (a: Account, t: Transaction) => t.recipient,
  getRecipientWarning: () => Promise.resolve(null),

  getTransactionLabel: (a: Account, t: Transaction) => t.label,
  editTransactionLabel: (account: Account, t: Transaction, label: string) => ({
    ...t,
    label
  }),
  getTransactionNote: (a: Account, t: Transaction) => t.note,
  editTransactionNote : (account: Account, t: Transaction, note: string) => ({
    ...t,
    note
  }),
  composeAndBroadcast: (operation_id: number, restlay: RestlayEnvironment, account: Account, transaction: Transaction) => { // eslint-disable-line
    // fill with new data obj and endpoint
    // const data: * = {
    //   operation: {},
    //   accountId: account.id
    // };
    return Promise.resolve(true);
  },
  EditFees,
  EditAdvancedOptions,
  checkValidTransaction,
  isRecipientValid
};

export default EthereumBridge;
