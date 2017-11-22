//@flow
import FiatUnits from "../fiat-units";

// This contains all the flow types for the Data Model (coming from the API)
// We have a little variation with the way client denormalize the data,
// therefore we will have _T_Entity types to be the denormalized form of _T_

export type Fiat = $Keys<typeof FiatUnits>;

export type Rate = {
  value: number,
  fiat: Fiat
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
  units: Unit[]
};
export type CurrencyEntity = Currency;

export type RateLimiter = {
  max_transaction: number,
  time_slot: number
};

export type SecurityScheme = {
  quorum: number,
  approvers: string[],
  time_lock?: number,
  rate_limiter?: RateLimiter
};

export type AccountSettings = {
  fiat: Fiat,
  unitIndex: number,
  countervalueSource: string,
  blockchainExplorer: string
};

type AccountCommon = {
  id: string,
  name: string,
  currencyRate: Rate,
  currencyRateInReferenceFiat: Rate,
  settings: AccountSettings,
  security_scheme: SecurityScheme,
  balance: number,
  creation_time: string,
  receive_address: string,
  balance_history: { [_: string]: number },
  approved: string[]
};
export type Account = AccountCommon & {
  currency: Currency
};

export type AccountEntity = AccountCommon & {
  currency: string
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
  body: string,
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
  address?: string,
  signature_script?: string,
  coinbase?: string,
  sequence?: number
};

export type TransactionOutput = {
  index: number,
  value: number,
  address?: string,
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

type OperationCommon = {
  uuid: string,
  currency_name: string,
  currency_family: string,
  trust: Trust,
  confirmations: number,
  time: string,
  approvedTime: ?string,
  endOfTimeLockTime: ?string,
  endOfRateLimiterTime: ?string,
  type: string,
  amount: number,
  rate: Rate,
  fees: number,
  account_id: string,
  approved: string[],
  senders: string[],
  recipients: string[],
  transaction: Transaction,
  exploreURL: ?string
};
export type Operation = OperationCommon & {
  notes: Note[]
};
export type OperationEntity = OperationCommon & {
  notes: NoteEntity[]
};

export type lineChartPoint = {
  time: Date,
  amount: number,
  tooltip: boolean,
  rate: Rate
};

export type lineChartPointEnhanced = {
  ...lineChartPoint,
  x: number,
  y: number
};

export type pieChartData = {
  account: Account,
  balance: number,
  counterValueBalance: number
};
