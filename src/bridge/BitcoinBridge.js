// @flow

import { BigNumber } from "bignumber.js";
import ValidateAddressQuery from "api/queries/ValidateAddressQuery";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import PendingTransactionsQuery from "api/queries/PendingTransactionsQuery";
import NewTransactionMutation from "api/mutations/NewTransactionMutation";
import type { Input as NewTransactionMutationInput } from "api/mutations/NewTransactionMutation";
import type { Account } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";
import FeesBitcoinKind from "components/FeesField/BitcoinKind";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import type { WalletBridge } from "./types";

// convertion to the BigNumber needed
export type Transaction = {
  amount: BigNumber,
  recipient: string,
  estimatedFees: ?BigNumber,
  feeLevel: Speed,
  label: string,
  note: string,
};

const checkValidTransaction = async (a, t, r) => {
  const currency = getCryptoCurrencyById(a.currency);
  const recipientIsValid = await isRecipientValid(r, currency, t.recipient);
  const amountIsValid = t.amount.plus(t.estimatedFees).isLessThan(a.balance);
  if (
    !t.estimatedFees ||
    t.estimatedFees.isEqualTo(0) ||
    t.amount.isEqualTo(0) ||
    !recipientIsValid ||
    !amountIsValid
  ) {
    return false;
  }
  return true;
};

const isRecipientValid = async (restlay, currency, recipient) => {
  if (recipient) {
    try {
      const { is_valid } = await restlay.fetchQuery(
        new ValidateAddressQuery({ currency, address: recipient }),
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

const BitcoinBridge: WalletBridge<Transaction> = {
  createTransaction: () => ({
    amount: BigNumber(0),
    recipient: "",
    estimatedFees: null,
    feeLevel: "normal",
    label: "",
    note: "",
  }),

  getFees: (a, t) => Promise.resolve(t.estimatedFees || 0),

  getTotalSpent: (a, t) => {
    const estimatedFees = t.estimatedFees || BigNumber(0);
    return t.amount.isEqualTo(0)
      ? Promise.resolve(BigNumber(0))
      : Promise.resolve(t.amount.plus(estimatedFees));
  },

  editTransactionAmount: (
    account: Account,
    t: Transaction,
    amount: BigNumber,
  ) => ({
    ...t,
    amount,
  }),

  getTransactionAmount: (a: Account, t: Transaction) => t.amount,

  editTransactionRecipient: (
    account: Account,
    t: Transaction,
    recipient: string,
  ) => ({
    ...t,
    recipient,
  }),

  getTransactionRecipient: (a: Account, t: Transaction) => t.recipient,

  getTransactionFeeLevel: (a: Account, t: Transaction) => t.feeLevel,
  editTransactionFeeLevel: (
    account: Account,
    t: Transaction,
    feeLevel: string,
  ) => ({
    ...t,
    feeLevel,
  }),

  getTransactionLabel: (a: Account, t: Transaction) => t.label,
  editTransactionLabel: (account: Account, t: Transaction, label: string) => ({
    ...t,
    label,
  }),
  getTransactionNote: (a: Account, t: Transaction) => t.note,
  editTransactionNote: (account: Account, t: Transaction, note: string) => ({
    ...t,
    note,
  }),
  composeAndBroadcast: (
    transaction_id: number,
    restlay: RestlayEnvironment,
    account: Account,
    transaction: Transaction,
  ) => {
    const data: NewTransactionMutationInput = {
      transaction: {
        fee_level: transaction.feeLevel,
        amount: transaction.amount,
        recipient: transaction.recipient,
        transaction_id,
        note: {
          title: transaction.label,
          content: transaction.note,
        },
      },
      accountId: account.id,
    };
    return restlay
      .commitMutation(new NewTransactionMutation(data))
      .then(() => restlay.fetchQuery(new PendingTransactionsQuery()));
  },
  EditFees: FeesBitcoinKind,
  checkValidTransaction,
  isRecipientValid,
};

export default BitcoinBridge;
