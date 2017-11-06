//@flow

// TODO move this in data/ folder

export type Rate = {
  value: number,
  currency_name: string
};

export type Unit = {
  name: string,
  code: string,
  symbol: string,
  magnitude: number,
  showAllDigits?: boolean
};

export type Currency = {
  name: string,
  family: string,
  color: string,
  units: Array<Unit>,
  rate?: Rate
};

export type Account = *; // TODO

export type Member = *;

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
  currency: Currency,
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
  rate: {
    value: number,
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
