// @flow
import React from "react";
import invariant from "invariant";

import type { WalletBridge } from "./types";
import type { Account } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";
import ValidateAddressQuery from "api/queries/ValidateAddressQuery";
import type { Input as NewEthereumOperationMutationInput } from "api/mutations/NewEthereumOperationMutation";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import NewEthereumOperationMutation from "api/mutations/NewEthereumOperationMutation";
import FeesFieldEthereumKind from "components/FeesField/EthereumKind";

//convertion to the BigNumber needed
export type Transaction = {
  recipient: string,
  amount: number,
  gasPrice: ?number,
  gasLimit: number,
  label: string,
  note: string
};

const EditAdvancedOptions = () => <div>Placeholder for Advanced Options </div>;

const isRecipientValid = async (restlay, currency, recipient) => {
  if (recipient) {
    try {
      const { is_valid } = await restlay.fetchQuery(
        new ValidateAddressQuery({ currency, address: recipient })
      );
      return is_valid;
    } catch (err) {
      // TODO: create internal logger
      return false;
    }
  } else {
    return false;
  }
};

const checkValidTransaction = async (a, t, r) => {
  const recipientIsValid = await isRecipientValid(r, a.currency, t.recipient);
  const fees = await getFees(a, t);
  const amountIsValid = t.amount + fees < a.balance;
  if (!t.gasPrice || !t.amount || !recipientIsValid || !amountIsValid) {
    return false;
  } else {
    return true;
  }
};

const getFees = (a, t) =>
  t.gasPrice === null || t.gasPrice === undefined
    ? Promise.resolve(0)
    : Promise.resolve(t.gasPrice * t.gasLimit);

const EthereumBridge: WalletBridge<Transaction> = {
  createTransaction: () => ({
    amount: 0,
    recipient: "",
    gasPrice: null,
    gasLimit: 21000,
    label: "",
    note: ""
  }),

  getTotalSpent: async (a, t) => {
    const fees = await getFees(a, t);
    return t.amount == 0 ? 0 : t.amount + fees;
  },

  getFees,

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
    transaction: Transaction // eslint-disable-line
  ) => {
    invariant(
      transaction.gasPrice !== null && transaction.gasPrice !== undefined,
      "gasPrice is unset"
    );
    const data: NewEthereumOperationMutationInput = {
      operation: {
        amount: transaction.amount,
        recipient: transaction.recipient,
        operation_id: operation_id,
        gas_price: transaction.gasPrice,
        gas_limit: transaction.gasLimit,
        note: {
          title: transaction.label,
          content: transaction.note
        }
      },
      accountId: account.id
    };
    return restlay
      .commitMutation(new NewEthereumOperationMutation(data))
      .then(() => restlay.fetchQuery(new PendingOperationsQuery()));
  },
  EditFees: FeesFieldEthereumKind,
  EditAdvancedOptions,
  checkValidTransaction,
  isRecipientValid
};

export default EthereumBridge;
