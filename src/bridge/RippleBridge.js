// @flow
import { BigNumber } from "bignumber.js";
import { InvalidAddressBecauseDestinationIsAlsoSource } from "@ledgerhq/errors";

import type { Account, TransactionCreationNote } from "data/types";
import ValidateAddressQuery from "api/queries/ValidateAddressQuery";
import FeesFieldRippleKind from "components/FeesField/RippleKind";
import ExtraFieldRippleKind, {
  hints as destinationTagHints,
} from "components/ExtraFields/RippleKind";
import { InvalidAddress } from "utils/errors";
import { evalHints } from "components/base/form/HintsWrapper";
import type { XRPFees, FeesLevel } from "bridge/fees.types";
import type { WalletBridge } from "./types";

export type Transaction = {|
  error: ?Error,
  note: TransactionCreationNote,

  recipient: string,
  amount: BigNumber,
  destinationTag: string,

  // edited fees
  fees: XRPFees,

  // estimated by backend
  estimatedFees: ?BigNumber,
|};

const resetFees = {
  error: null,
  estimatedFees: null,
};

export const MIN_RIPPLE_BALANCE = 20 * 10 ** 6;

const isRecipientValid = async (restlay, currency, recipient) => {
  if (!recipient) return false;
  try {
    const { is_valid } = await restlay.fetchQuery(
      new ValidateAddressQuery({ currency, address: recipient }),
    );
    return is_valid;
  } catch (err) {
    return false;
  }
};

const fetchRecipientError = async (restlay, currency, recipient, account) => {
  if (account && recipient === account.address) {
    return new InvalidAddressBecauseDestinationIsAlsoSource();
  }
  const isValid = await isRecipientValid(restlay, currency, recipient);
  return isValid ? null : new InvalidAddress(null, { ticker: currency.ticker });
};

const RippleBridge: WalletBridge<Transaction> = {
  FeesField: FeesFieldRippleKind,
  ExtraFields: ExtraFieldRippleKind,

  createTransaction: () => ({
    ...resetFees,
    recipient: "",
    amount: BigNumber(0),
    destinationTag: "",
    note: { title: "", content: "" },
    fees: { fees_level: "normal" },
  }),

  editTransactionAmount: (t: Transaction, amount: BigNumber) => {
    if (t.fees.fees_level === "custom") {
      return { ...t, error: null, amount };
    }
    return { ...t, ...resetFees, amount };
  },

  editTransactionFees: (account: Account, t: Transaction, fees: XRPFees) => ({
    ...t,
    fees,
    estimatedFees: null,
  }),

  editTransactionFeesLevel: (t: Transaction, fees_level: FeesLevel) => {
    if (fees_level === "custom") {
      return {
        ...t,
        error: null,
        fees: { fees_level, fees: t.estimatedFees || BigNumber(0) },
      };
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
  }),

  getEstimatedFees: t => t.estimatedFees,

  getMaxAmount: _t => null,

  getTotalSpent: (a, t) => {
    const fees = t.estimatedFees || BigNumber(0);
    return t.amount.isEqualTo(0) ? BigNumber(0) : t.amount.plus(fees);
  },

  getTransactionError: (t: Transaction) => t.error,

  getTransactionNote: (t: Transaction) => t.note,

  checkValidTransactionSync: (a: Account, t: Transaction) => {
    if (t.amount.isEqualTo(0)) return false;
    const { estimatedFees } = t;
    if (!estimatedFees) return false;
    if (!estimatedFees.isGreaterThan(0)) return false;
    if (
      evalHints(destinationTagHints, t.destinationTag).some(
        h => h.status === "invalid",
      )
    )
      return false;
    const totalSpent = RippleBridge.getTotalSpent(a, t);
    if (totalSpent.isGreaterThan(a.balance.minus(MIN_RIPPLE_BALANCE)))
      return false;
    return true;
  },

  fetchRecipientError,
};

export default RippleBridge;
