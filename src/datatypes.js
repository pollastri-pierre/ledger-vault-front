//@flow
export type Unit = {
  name: string,
  code: string,
  symbol: string,
  magnitude: number
};

export type Currency = {
  name: string,
  family: string,
  color: string,
  units: Array<Unit>
};

export type Account = *; // TODO

export type Note = *;

export type TransactionInput = *;
export type TransactionOutput = *;
export type Transaction = {
  version: string,
  hash: string,
  lock_time: string,
  inputs: Array<TransactionInput>,
  outputs: Array<TransactionOutput>
};

export type Operation = {
  uuid: string,
  currency_name: string,
  currency_family: string,
  trust: {
    level: string,
    weight: number,
    conflicts: Array<string>,
    origin: string
  },
  confirmations: number,
  time: string,
  type: string,
  amount: number,
  reference_conversion: {
    amount: number,
    currency_name: string
  },
  fees: number,
  account_id: number,
  senders: Array<string>,
  recipients: Array<string>,
  notes: Array<Node>,
  transaction: Transaction
};

export type PendingEvent =
  | { type: "account", data: Account }
  | { type: "operation", data: Operation };
