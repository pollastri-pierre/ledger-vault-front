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
import type { WalletBridge } from "./types";

export type Transaction = {|
  recipient: string,
  amount: BigNumber,
  note: TransactionCreationNote,
  estimatedFees: ?BigNumber,
  destinationTag: string,
|};

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

const getRecipientError = async (restlay, currency, recipient, account) => {
  if (account && recipient === account.address) {
    return new InvalidAddressBecauseDestinationIsAlsoSource();
  }
  const isValid = await isRecipientValid(restlay, currency, recipient);
  return isValid ? null : new InvalidAddress();
};

const getFees = (a, t) => t.estimatedFees || BigNumber(0);

const RippleBridge: WalletBridge<Transaction> = {
  createTransaction: () => ({
    amount: BigNumber(0),
    recipient: "",
    estimatedFees: null,
    destinationTag: "",
    note: {
      title: "",
      content: "",
    },
  }),

  getTotalSpent: (a, t) => {
    const fees = t.estimatedFees || BigNumber(0);
    return t.amount.isEqualTo(0) ? BigNumber(0) : t.amount.plus(fees);
  },

  getFees,

  editTransactionAmount: (a: Account, t: Transaction, amount: BigNumber) => ({
    ...t,
    amount,
    estimatedFees: null,
  }),

  getTransactionAmount: (a: Account, t: Transaction) => t.amount,

  editTransactionRecipient: (
    a: Account,
    t: Transaction,
    recipient: string,
  ) => ({ ...t, recipient, estimatedFees: null }),

  getTransactionRecipient: (a: Account, t: Transaction) => t.recipient,

  getTransactionNote: (t: Transaction) => t.note,
  editTransactionNote: (t: Transaction, note: TransactionCreationNote) => ({
    ...t,
    note,
  }),

  EditFees: FeesFieldRippleKind,
  ExtraFields: ExtraFieldRippleKind,

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
    return true;
  },

  getRecipientError,
};

export default RippleBridge;
