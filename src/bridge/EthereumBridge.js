// @flow

import { BigNumber } from "bignumber.js";

import type { Account, TransactionCreationNote } from "data/types";
import ValidateAddressQuery from "api/queries/ValidateAddressQuery";
import FeesFieldEthereumKind from "components/FeesField/EthereumKind";
import { InvalidAddress } from "utils/errors";
import { isChecksumAddress } from "utils/eip55";

import type { ETHFees, FeesLevel } from "bridge/fees.types";
import type { WalletBridge } from "./types";

export type Transaction = {|
  error: ?Error,
  note: TransactionCreationNote,

  recipient: string,
  amount: BigNumber,

  // edited fees
  fees: ETHFees,

  // estimated by backend
  gasPrice: BigNumber | null,
  gasLimit: BigNumber | null,
|};

const resetFees = {
  error: null,
  gasPrice: null,
  gasLimit: null,
};

const fetchRecipientError = async (restlay, currency, recipient) => {
  const isValid = await isRecipientValid(restlay, currency, recipient);
  return isValid ? null : new InvalidAddress(null, { ticker: currency.ticker });
};

const isRecipientValid = async (restlay, currency, recipient) => {
  if (recipient) {
    if (!recipient.match(/^0x[0-9a-fA-F]{40}$/)) return false;
    if (!isChecksumAddress(recipient)) return false;
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

const getEstimatedFees = (t) =>
  t.gasPrice && t.gasLimit ? t.gasPrice.times(t.gasLimit) : null;

const EthereumBridge: WalletBridge<Transaction> = {
  FeesField: FeesFieldEthereumKind,

  createTransaction: () => ({
    recipient: "",
    amount: BigNumber(0),
    note: { title: "", content: "" },

    ...resetFees,

    fees: { fees_level: "normal" },
  }),

  editTransactionAmount: (t: Transaction, amount: BigNumber) => {
    if (t.fees.fees_level === "custom") {
      return { ...t, error: null, amount };
    }
    return {
      ...t,
      ...resetFees,
      amount,
    };
  },

  editTransactionFees: (a: Account, t: Transaction) => t,

  editTransactionFeesLevel: (t: Transaction, fees_level: FeesLevel) => {
    if (fees_level === "custom") {
      return {
        ...t,
        error: null,
        fees: {
          fees_level,
          gas_price: t.gasPrice,
          gas_limit: t.gasLimit,
        },
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
  }),

  getEstimatedFees,

  getMaxAmount: (_t) => null,

  getTotalSpent: (a, t) => {
    if (a.account_type === "Erc20") {
      return t.amount;
    }
    const estimatedFees = getEstimatedFees(t) || BigNumber(0);
    return t.amount.isEqualTo(0) ? BigNumber(0) : t.amount.plus(estimatedFees);
  },

  getTransactionError: (t: Transaction) => t.error,

  getTransactionNote: (t: Transaction) => t.note,

  checkValidTransactionSync: (a: Account, t: Transaction) => {
    if (t.amount.isEqualTo(0)) return false;
    const { gasPrice, gasLimit } = t;
    if (!gasPrice || !gasLimit) return false;
    const estimatedFees = gasPrice.times(gasLimit);
    if (!estimatedFees.isGreaterThan(0)) return false;
    if (a.account_type === "Erc20") {
      if (!a.parent_balance) return false;
      if (estimatedFees.isGreaterThan(a.parent_balance)) return false;
    } else if (t.amount.plus(estimatedFees).isGreaterThan(a.balance)) {
      return false;
    }
    return true;
  },

  fetchRecipientError,
};

export default EthereumBridge;
