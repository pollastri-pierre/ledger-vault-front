// @flow
import ValidateAddressQuery from "api/queries/ValidateAddressQuery";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import NewOperationMutation from "api/mutations/NewOperationMutation";
import type { Input as NewOperationMutationInput } from "api/mutations/NewOperationMutation";
import type { WalletBridge } from "./types";
import type { Account } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";
import FeesBitcoinKind from "components/FeesField/BitcoinKind";
import { getCryptoCurrencyById } from "utils/cryptoCurrencies";

//convertion to the BigNumber needed
export type Transaction = {
  amount: number,
  recipient: string,
  estimatedFees: ?number,
  feeLevel: Speed,
  label: string,
  note: string
};

const checkValidTransaction = async (a, t, r) => {
  const currency = getCryptoCurrencyById(a.currency_id);
  const recipientIsValid = await isRecipientValid(r, currency, t.recipient);
  const amountIsValid = t.amount + t.estimatedFees < a.balance;
  if (!t.estimatedFees || !t.amount || !recipientIsValid || !amountIsValid) {
    return false;
  } else {
    return true;
  }
};

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

const BitcoinBridge: WalletBridge<Transaction> = {
  createTransaction: () => ({
    amount: 0,
    recipient: "",
    estimatedFees: null,
    feeLevel: "normal",
    label: "",
    note: ""
  }),

  getFees: (a, t) => Promise.resolve(t.estimatedFees || 0),

  getTotalSpent: (a, t) =>
    t.amount == 0
      ? Promise.resolve(0)
      : Promise.resolve(t.amount + t.estimatedFees),

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

  getTransactionFeeLevel: (a: Account, t: Transaction) => t.feeLevel,
  editTransactionFeeLevel: (
    account: Account,
    t: Transaction,
    feeLevel: string
  ) => ({
    ...t,
    feeLevel
  }),

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
    transaction: Transaction
  ) => {
    const data: NewOperationMutationInput = {
      operation: {
        fee_level: transaction.feeLevel,
        amount: transaction.amount,
        recipient: transaction.recipient,
        operation_id: operation_id,
        note: {
          title: transaction.label,
          content: transaction.note
        }
      },
      accountId: account.id
    };
    return restlay
      .commitMutation(new NewOperationMutation(data))
      .then(() => restlay.fetchQuery(new PendingOperationsQuery()));
  },
  EditFees: FeesBitcoinKind,
  checkValidTransaction,
  isRecipientValid
};

export default BitcoinBridge;
