// @flow
import React from "react";
import { BigNumber } from "bignumber.js";

import type { Account, TransactionCreationNote } from "data/types";
import ValidateAddressQuery from "api/queries/ValidateAddressQuery";
import FeesFieldEthereumKind from "components/FeesField/EthereumKind";
import { NonEIP55Address, InvalidAddress } from "utils/errors";
import type { WalletBridge } from "./types";

export type Transaction = {
  recipient: string,
  amount: BigNumber,
  gasPrice: ?BigNumber,
  gasLimit: ?BigNumber,
  note: TransactionCreationNote,
  estimatedFees: ?BigNumber,
  error: ?Error,
};

const EditAdvancedOptions = () => <div>Placeholder for Advanced Options </div>;

const getRecipientWarning = async recipient => {
  // TODO: temp solution until centralized
  if (!recipient.match(/^0x[0-9a-fA-F]{40}$/)) return null;
  const slice = recipient.substr(2);
  const isFullUpper = slice === slice.toUpperCase();
  const isFullLower = slice === slice.toLowerCase();
  if (isFullUpper || isFullLower) {
    return new NonEIP55Address();
  }
  return null;
};

const getRecipientError = async (restlay, currency, recipient) => {
  const isValid = await isRecipientValid(restlay, currency, recipient);
  return isValid ? null : new InvalidAddress();
};

const isRecipientValid = async (restlay, currency, recipient) => {
  if (recipient) {
    if (!recipient.match(/^0x[0-9a-fA-F]{40}$/)) return false;
    const warning = await getRecipientWarning(recipient);
    if (warning) return true;
    try {
      const { is_valid } = await restlay.fetchQuery(
        new ValidateAddressQuery({ currency, address: recipient }),
      );
      return is_valid;
    } catch (err) {
      // TODO: create internal logger
      console.error(err); // eslint-disable-line no-console
      return false;
    }
  } else {
    return false;
  }
};

const getFees = (a, t) =>
  t.gasPrice && t.gasLimit ? t.gasPrice.times(t.gasLimit) : BigNumber(0);

const EthereumBridge: WalletBridge<Transaction> = {
  createTransaction: () => ({
    amount: BigNumber(0),
    recipient: "",
    gasPrice: null,
    gasLimit: null,
    error: null,
    label: "",
    note: {
      title: "",
      content: "",
    },
    estimatedFees: null,
  }),

  getTotalSpent: (a, t) => {
    const fees = t.estimatedFees || BigNumber(0);
    if (a.account_type === "Erc20") {
      return t.amount;
    }
    return t.amount.isEqualTo(0) ? BigNumber(0) : t.amount.plus(fees);
  },

  getFees,

  editTransactionAmount: (
    account: Account,
    t: Transaction,
    amount: BigNumber,
  ) => ({
    ...t,
    amount,
  }),

  getTransactionAmount: (a: Account, t: Transaction) => t.amount,

  getTransactionError: (a: Account, t: Transaction) => t.error,
  editTransactionRecipient: (
    account: Account,
    t: Transaction,
    recipient: string,
  ) => ({
    ...t,
    recipient,
    estimatedFees: null,
  }),

  getTransactionRecipient: (a: Account, t: Transaction) => t.recipient,

  getTransactionNote: (t: Transaction) => t.note,
  editTransactionNote: (t: Transaction, note: TransactionCreationNote) => ({
    ...t,
    note,
  }),
  EditFees: FeesFieldEthereumKind,
  EditAdvancedOptions,
  checkValidTransactionSync: (a: Account, t: Transaction) => {
    if (t.amount.isEqualTo(0)) return false;
    const { estimatedFees } = t;
    if (!estimatedFees) return false;
    if (!estimatedFees.isGreaterThan(0)) return false;
    if (a.account_type === "Erc20") {
      //
      // FIXME FIXME FIXME
      // cf - https://ledgerhq.atlassian.net/browse/LV-2050
      //    - https://ledgerhq.atlassian.net/browse/LV-2050
      //
      // Put back those lines when the gate fixes the regression:
      //
      // if (!a.parent_balance) return false;
      // if (estimatedFees.isGreaterThan(a.parent_balance)) return false;
      //
    } else if (t.amount.plus(t.estimatedFees).isGreaterThan(a.balance)) {
      return false;
    }
    return true;
  },
  getRecipientError,
  getRecipientWarning,
};

export default EthereumBridge;
