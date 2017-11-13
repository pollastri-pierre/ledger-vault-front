//@flow

// TODO move this in data/ folder

export type Rate = {|
  value: number,
  currency_name: string
|};

export type Unit = {|
  name: string,
  code: string,
  symbol: string,
  magnitude: number,
  showAllDigits?: boolean
|};

export type Currency = {|
  name: string,
  family: string,
  color: string,
  units: Array<Unit>,
  rate?: Rate
|};

export type SecurityScheme = {|
  quorum: number,
  approvers: string[],
  time_lock?: number,
  rate_limiter?: {|
    max_transaction: number,
    time_slot: number
  |}
|};

export type Account = {|
  id: string,
  name: string,
  currency: Currency,
  security_scheme: SecurityScheme,
  balance: number,
  creation_time: string,
  receive_address: string,
  balance_history: { [_: string]: number },
  approved: string[]
|};

export type Member = {|
  id: string,
  pub_key: string,
  first_name: string,
  last_name: string,
  picture: string,
  register_date: string,
  u2f_device: string,
  email: string,
  groups: number[],
  role: string
|};

export type Note = {|
  id: string,
  title: string,
  body: string,
  created_at: string,
  author: Member
|};

export type TransactionInput = {|
  index: number,
  value: number,
  previous_tx_hash?: string,
  previous_tx_output_index?: number,
  address?: string,
  signature_script?: string,
  coinbase?: string,
  sequence?: number
|};

export type TransactionOutput = *;

export type Transaction = {|
  version: string,
  hash: string,
  lock_time: string,
  inputs: Array<TransactionInput>,
  outputs: Array<TransactionOutput>
|};

export type Trust = {|
  level: string,
  weight: number,
  conflicts: Array<string>,
  origin: string
|};

export type Operation = {|
  uuid: string,
  currency_name: string,
  currency_family: string,
  currency: Currency,
  trust: Trust,
  confirmations: number,
  time: string,
  type: string,
  amount: number,
  rate: Rate,
  fees: number,
  //account_id: string,
  account: Account,
  approved: Array<string>,
  senders: Array<string>,
  recipients: Array<string>,
  notes: Array<Node>,
  transaction: Transaction
|};
