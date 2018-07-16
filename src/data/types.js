//@flow

// This contains all the flow types for the Data Model (coming from the API)
// We have a little variation with the way client denormalize the data,
// therefore we will have _T_Entity types to be the denormalized form of _T_

// export type Fiat = {
//   id: number,
//   name: string,
//   type: string
// };

export type Translate = (?string, ?Object) => string;

export type Fiat = string;

export type Organization = {
  name: string,
  domain_name: string,
  workspace: string
};

type Price = {
  amount: number
};

export type Unit = {
  id?: number,
  name: string,
  code: string,
  symbol?: string,
  magnitude: number,
  showAllDigits?: boolean
};

export type Currency = {
  name: string,
  family: string,
  color: string,
  units: Unit[]
};
export type CurrencyEntity = Currency;

export type RateLimiter = {
  max_transaction: number,
  time_slot: number
};

export type SecurityScheme = {
  quorum: number,
  time_lock?: number,
  rate_limiter?: RateLimiter,
  auto_expire?: number | null
};

export type AccountSettings = {
  id: number,
  fiat: Fiat,
  currency_unit: Unit,
  unitIndex: number,
  blockchain_explorer: string
};

type MemberCommon = {
  id: string,
  pub_key: string,
  first_name: string,
  last_name: string,
  picture: string,
  register_date: string,
  u2f_device: string,
  email: string,
  role: string,
  groups: string[]
};
export type MemberEntity = MemberCommon;
export type Member = MemberCommon;

export type Approval = {
  created_on: Date,
  person: Member,
  type: "APPROVE" | "ABORT"
};

type AccountCommon = {
  id: number,
  name: string,
  members: Member[],
  settings: AccountSettings,
  security_scheme: SecurityScheme,
  balance: number,
  creation_time: string,
  receive_address: string,
  balance_history: { [_: string]: number },
  approvals: Approval[],
  fresh_addresses: *,
  hsm_operations?: Object
};
export type Account = AccountCommon & {
  currency: Currency
};

export type AccountEntity = AccountCommon & {
  currency: string
};

type GroupCommon = {
  id: string,
  name: string
};
export type GroupEntity = GroupCommon & {
  members: string[]
};
export type Group = GroupCommon & {
  members: Member[]
};

type NoteCommon = {
  id: string,
  title: string,
  content: string,
  created_at: string
};
export type Note = NoteCommon & {
  author: Member
};
export type NoteEntity = NoteCommon & {
  author: string
};

export type TransactionInput = {
  index: number,
  value: number,
  previous_tx_hash?: string,
  previous_tx_output_index?: number,
  address: string,
  signature_script?: string,
  coinbase?: string,
  sequence?: number
};

export type TransactionOutput = {
  index: number,
  value: number,
  address: string,
  script?: string
};

export type Transaction = {
  version: string,
  hash: string,
  lock_time: string,
  inputs: TransactionInput[],
  outputs: TransactionOutput[]
};

export type Trust = {
  level: string,
  weight: number,
  conflicts: string[],
  origin: string
};

export type TransactionType = "SEND" | "RECEIVE";

type OperationCommon = {
  id: number,
  currency_name: string,
  currency_family: string,
  trust: Trust,
  confirmations: number,
  time: string,
  price: Price,
  fees: Price,
  approvedTime: ?string,
  endOfTimeLockTime: ?string,
  endOfRateLimiterTime: ?string,
  type: TransactionType,
  amount: number,
  account_id: string,
  approved: string[],
  senders: string[],
  recipients: string[],
  transaction: Transaction,
  exploreURL: ?string,
  approvals: Approval[],
  tx_hash: ?string,
  status: string,
  hsm_operations?: Object
};
export type Operation = OperationCommon & {
  notes: Note[]
};
export type OperationEntity = OperationCommon & {
  notes: NoteEntity[]
};

export type ActivityCommon = {
  id: number,
  seen: boolean,
  show: boolean,
  created_on: Date
};

export type ActivityGeneric = {
  id: number,
  seen: boolean,
  show: boolean,
  created_on: Date,
  business_action: ActivityEntityAccount | ActivityEntityOperation
};

export type ActivityEntityAccount = ActivityCommon & {
  business_action: {
    id: number,
    account: AccountEntity,
    author: MemberCommon,
    business_action_name: string,
    message: string,
    target_id: number,
    target_type: string
  }
};

export type ActivityEntityOperation = ActivityCommon & {
  business_action: {
    id: number,
    operation: *,
    author: MemberCommon,
    business_action_name: string,
    message: string,
    target_id: number,
    target_type: string
  }
};
