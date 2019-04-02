// @flow
import React from "react";
import invariant from "invariant";

import type { Account } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";
import ValidateAddressQuery from "api/queries/ValidateAddressQuery";
import type { Input as NewEthereumOperationMutationInput } from "api/mutations/NewEthereumOperationMutation";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import NewEthereumOperationMutation from "api/mutations/NewEthereumOperationMutation";
import FeesFieldEthereumKind from "components/FeesField/EthereumKind";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import type { WalletBridge } from "./types";

// convertion to the BigNumber needed
export type Transaction = {
  recipient: string,
  amount: number,
  gasPrice: number,
  gasLimit: number,
  label: string,
  note: string
};

const EditAdvancedOptions = () => <div>Placeholder for Advanced Options </div>;

const getRecipientWarning = async recipient => {
  // TODO: temp solution until centralized
  const EIP55Error = new Error(
    "Auto-verification not available: carefully verify the address"
  );
  if (!recipient.match(/^0x[0-9a-fA-F]{40}$/)) return null;
  const slice = recipient.substr(2);
  const isFullUpper = slice === slice.toUpperCase();
  const isFullLower = slice === slice.toLowerCase();
  if (isFullUpper || isFullLower) {
    return EIP55Error;
  }
  return null;
};

const isRecipientValid = async (restlay, currency, recipient) => {
  if (recipient) {
    if (!recipient.match(/^0x[0-9a-fA-F]{40}$/)) return false;
    const warning = await getRecipientWarning(recipient);
    if (warning) return true;
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
// TODO: has to be either updated to include ERC20 validation or a new bridge written
const checkValidTransaction = async (a, t, r) => {
  const currency = getCryptoCurrencyById(a.currency_id);
  const recipientIsValid = await isRecipientValid(r, currency, t.recipient);
  const fees = await getFees(a, t);
  let amountIsValid;
  if (a.account_type === "ERC20") {
    amountIsValid = t.amount < a.balance;
  } else {
    amountIsValid = t.amount + fees < a.balance;
  }
  if (!t.gasPrice || !t.amount || !recipientIsValid || !amountIsValid) {
    return false;
  }
  return true;
};
// TODO: generalize parentAccount to some generic extra data param
const checkValidFee = async (account, transaction, parentAccount) => {
  const fees = await getFees(account, transaction);
  const validFees = fees < parentAccount.balance;
  return validFees;
};
const getFees = (a, t) => Promise.resolve(t.gasPrice * t.gasLimit);

const computeTotal = (a, t, fees) => {
  if (a.account_type === "ERC20") {
    return t.amount;
  }
  return t.amount === 0 ? 0 : t.amount + fees;
};
const EthereumBridge: WalletBridge<Transaction> = {
  createTransaction: () => ({
    amount: 0,
    recipient: "",
    gasPrice: 0,
    gasLimit: 0,
    label: "",
    note: ""
  }),

  getTotalSpent: async (a, t) => {
    const fees = await getFees(a, t);
    return computeTotal(a, t, fees);
  },

  getFees,

  editTransactionAmount: (
    account: Account,
    t: Transaction,
    amount: number
  ) => ({
    ...t,
    amount
  }),

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
        operation_id,
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
  isRecipientValid,
  getRecipientWarning,
  checkValidFee
};

export default EthereumBridge;
