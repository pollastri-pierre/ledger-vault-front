// @flow

// This contains all the flow types for the Data Model (coming from the API)
// We have a little variation with the way client denormalize the data,
// therefore we will have _T_Entity types to be the denormalized form of _T_

// export type Fiat = {
//   id: number,
//   name: string,
//   type: string
// };

export type Translate = (?string, ?Object) => any;

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
  ticker: string,
  color: string,
  payment_uri_scheme: string,
  issue_message?: string,
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
  username: string,
  picture?: string,
  created_on: string,
  status: string,
  email?: string,
  role: string
};
export type MemberEntity = MemberCommon;
export type Member = MemberCommon;

export type MemberInvite = {
  id: string,
  is_complete: boolean,
  status: string,
  type: string,
  url_id: string,
  user: {
    id: string,
    key_handle: ?string,
    pub_key: ?string,
    username: string,
    created_on: string,
    user_id: string
  }
};

export type Approval = {
  created_on: Date,
  person: Member,
  type: "APPROVE" | "ABORT"
};

type AccountType = "Ethereum" | "Bitcoin" | "ERC20";
type AccountCommon = {
  id: number,
  account_type: AccountType,
  contract_address: string,
  parent_id?: number,
  name: string,
  members: Member[],
  settings: AccountSettings,
  security_scheme: SecurityScheme,
  balance: number,
  number_of_approvals: number,
  created_on: Date,
  approvals: Approval[],
  fresh_addresses: *,
  hsm_operations?: Object,
  is_hsm_coin_app_updated: boolean,
  index: number,
  status: string
};
export type Account = AccountCommon & {
  currency_id: string
};

export type OperationRecipientIsValid = {
  amount: number,
  recipient: string
};

export type OperationGetFees = {
  amount: number,
  recipient: string,
  fee_level?: string,
  gas_limit?: ?number,
  gas_price?: ?number
};
export type AccountEntity = AccountCommon & {
  currency: string
};

type GroupCommon = {
  id: string,
  name: string,
  created_on: Date,
  created_by: Member,
  description?: string,
  last_request_id?: number,
  status: string // TODO create UNION type when different status are known
};
export type GroupEntity = GroupCommon & {
  members: string[]
};
export type Group = GroupCommon & {
  members: Member[],
  approvals: Approval[]
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

export type TransactionETH = {
  block: Object,
  height: number,
  time: string,
  date: string,
  gas_limit: number,
  gas_price: number,
  hash: string,
  receiver: string,
  sender: string,
  value: number
};

export type TransactionType = "SEND" | "RECEIVE";

export type OperationStatus = "SUBMITTED" | "ABORTED" | "PENDING_APPROVAL";

type OperationCommon = {
  id: number,
  created_by: Member,
  currency_family: string,
  confirmations: number,
  created_on: Date,
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
  recipient: string[],
  recipients: string[],
  block_height?: number,
  time?: Date,
  transaction: Transaction,
  exploreURL: ?string,
  approvals: Approval[],
  tx_hash: ?string,
  status: OperationStatus,
  hsm_operations?: Object,
  error?: Object,
  gas_price?: number,
  gas_limit?: number
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

export type GateError = {
  json: {
    message: string,
    name: string,
    code: number
  },
  name: string,
  message: string,
  status: number
};

export type ERC20Token = {
  blockchain_name: string,
  contract_address: string,
  network_id: number,
  decimals: number,
  name: string,
  ticker: string,
  signature: string
};

type RequestCommon = {
  created_by: number,
  created_on: string,
  id: number,
  status: string,
  type: string,
  approvals: RequestApproval[],
  user?: RequestUser,
  group?: RequestGroup
};

export type Request = RequestCommon;

type RequestApproval = {
  created_by: Member,
  created_on: string,
  type: string
};
type RequestUser = {
  created_on: string,
  id: number,
  key_handle: string,
  pub_key: string,
  status: string,
  user_id: string,
  username: string
};
type RequestGroup = {};
