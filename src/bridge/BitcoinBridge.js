// @flow

import { BigNumber } from "bignumber.js";
import ValidateAddressQuery from "api/queries/ValidateAddressQuery";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import type { Account, TransactionCreationNote } from "data/types";
import FeesBitcoinKind from "components/FeesField/BitcoinKind";
import { InvalidAddress, AddressShouldNotBeSegwit } from "utils/errors";
import ExtraFieldBitcoinKind from "components/ExtraFields/BitcoinKind";
import type { UtxoPickingStrategy } from "utils/utxo";
import type { WalletBridge } from "./types";

export type Transaction = {
  amount: BigNumber,
  recipient: string,
  estimatedFees: ?BigNumber,
  estimatedMaxAmount: ?BigNumber,
  feeLevel: Speed,
  label: string,
  utxoPickingStrategy?: ?UtxoPickingStrategy,
  error: ?Error,
  note: TransactionCreationNote,
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
      console.error(err); // eslint-disable-line no-console
      return false;
    }
  } else {
    return false;
  }
};

const getRecipientError = async (restlay, currency, recipient) => {
  const isValid = await isRecipientValid(restlay, currency, recipient);
  if (!isValid) return new InvalidAddress(null, { ticker: currency.ticker });

  const isSegwit = isAddressSegwit(currency, recipient);

  return isSegwit ? new AddressShouldNotBeSegwit() : null;
};

const BitcoinBridge: WalletBridge<Transaction> = {
  createTransaction: () => ({
    amount: BigNumber(0),
    recipient: "",
    estimatedFees: null,
    estimatedMaxAmount: null,
    feeLevel: "normal",
    label: "",
    utxoPickingStrategy: null,
    error: null,
    note: {
      title: "",
      content: "",
    },
  }),

  getFees: (a, t) => t.estimatedFees,
  getMaxAmount: (a, t) => t.estimatedMaxAmount,

  getTotalSpent: (a, t) => {
    const estimatedFees = t.estimatedFees || BigNumber(0);
    return t.amount.isEqualTo(0) ? BigNumber(0) : t.amount.plus(estimatedFees);
  },

  editTransactionAmount: (
    account: Account,
    t: Transaction,
    amount: BigNumber,
  ) => ({
    ...t,
    amount,
    estimatedFees: null,
    estimatedMaxAmount: null,
    error: null,
  }),

  getTransactionError: (a: Account, t: Transaction) => t.error,
  getTransactionAmount: (a: Account, t: Transaction) => t.amount,

  editTransactionRecipient: (
    account: Account,
    t: Transaction,
    recipient: string,
  ) => ({
    ...t,
    recipient,
    estimatedFees: null,
    estimatedMaxAmount: null,
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
    estimatedFees: null,
  }),

  getTransactionNote: (t: Transaction) => t.note,
  editTransactionNote: (t: Transaction, note: TransactionCreationNote) => ({
    ...t,
    note,
  }),
  EditFees: FeesBitcoinKind,
  ExtraFields: ExtraFieldBitcoinKind,
  checkValidTransactionSync: (a: Account, t: Transaction) => {
    if (t.amount.isEqualTo(0)) return false;
    if (!t.estimatedFees) return false;
    if (!t.estimatedFees.isGreaterThan(0)) return false;
    if (t.amount.plus(t.estimatedFees).isGreaterThan(a.balance)) return false;
    if (!t.estimatedMaxAmount) return false;
    if (t.amount.isGreaterThan(t.estimatedMaxAmount)) return false;
    return true;
  },
  getRecipientError,
};

function isAddressSegwit(currency, recipient) {
  if (currency.id === "bitcoin" || currency.id === "bitcoin_testnet") {
    return recipient.startsWith("bc1");
  }
  return false;
}

export default BitcoinBridge;
