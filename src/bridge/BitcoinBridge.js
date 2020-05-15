// @flow

import { BigNumber } from "bignumber.js";
import ValidateAddressQuery from "api/queries/ValidateAddressQuery";
import type { Account, TransactionCreationNote } from "data/types";
import FeesBitcoinKind from "components/FeesField/BitcoinKind";
import { InvalidAddress } from "utils/errors";
import ExtraFieldBitcoinKind from "components/ExtraFields/BitcoinKind";
import type { UtxoPickingStrategy } from "utils/utxo";
import type { BTCFees, FeesLevel } from "bridge/fees.types";
import type { WalletBridge } from "./types";

export type Transaction = {|
  error: ?Error,
  note: TransactionCreationNote,

  recipient: string,
  amount: BigNumber,

  // optional strategy selection
  utxoPickingStrategy?: ?UtxoPickingStrategy,

  // used only on UTXOs consolidation
  expectedNbUTXOs: number | null,

  // edited fees
  fees: BTCFees,

  // estimated by backend
  estimatedFees: BigNumber | null,
  estimatedMaxAmount: BigNumber | null,
  fees_per_byte: BigNumber | null,
|};

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

const fetchRecipientError = async (restlay, currency, recipient) => {
  const isValid = await isRecipientValid(restlay, currency, recipient);
  if (!isValid) return new InvalidAddress(null, { ticker: currency.ticker });
  return null;
};

const resetFees = {
  error: null,
  estimatedFees: null,
  estimatedMaxAmount: null,
  fees_per_byte: null,
};

const BitcoinBridge: WalletBridge<Transaction> = {
  FeesField: FeesBitcoinKind,
  ExtraFields: ExtraFieldBitcoinKind,

  createTransaction: () => ({
    amount: BigNumber(0),
    recipient: "",
    note: { title: "", content: "" },
    utxoPickingStrategy: null,
    expectedNbUTXOs: null,

    ...resetFees,

    fees: { fees_level: "normal" },
  }),

  editTransactionAmount: (t: Transaction, amount: BigNumber) => ({
    ...t,
    ...resetFees,
    amount,
  }),

  editTransactionFees: (account: Account, t: Transaction, fees: BTCFees) => ({
    ...t,
    ...resetFees,
    fees,
  }),

  editTransactionFeesLevel: (t: Transaction, fees_level: FeesLevel) => {
    // for now, custom fees for bitcoin is disabled
    if (fees_level === "custom") {
      return t;
    }
    return { ...t, ...resetFees, fees: { fees_level } };
  },

  editTransactionNote: (t: Transaction, note: TransactionCreationNote) => ({
    ...t,
    note,
  }),

  editTransactionRecipient: (t: Transaction, recipient: string) => ({
    ...t,
    recipient,
    estimatedFees: null,
    estimatedMaxAmount: null,
  }),

  getEstimatedFees: (t) => t.estimatedFees,

  getMaxAmount: (t) => t.estimatedMaxAmount,

  getTotalSpent: (a, t) => {
    const estimatedFees = t.estimatedFees || BigNumber(0);
    return t.amount.isEqualTo(0) ? BigNumber(0) : t.amount.plus(estimatedFees);
  },

  getTransactionError: (t: Transaction) => t.error,

  getTransactionNote: (t: Transaction) => t.note,

  checkValidTransactionSync: (a: Account, t: Transaction) => {
    if (t.amount.isEqualTo(0)) return false;
    if (!t.estimatedFees) return false;
    if (!t.estimatedFees.isGreaterThan(0)) return false;
    if (t.amount.plus(t.estimatedFees).isGreaterThan(a.available_balance))
      return false;
    if (!t.estimatedMaxAmount) return false;
    if (t.amount.isGreaterThan(t.estimatedMaxAmount)) return false;
    return true;
  },

  fetchRecipientError,
};

export default BitcoinBridge;
