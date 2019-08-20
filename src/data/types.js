// @flow

import type { BigNumber } from "bignumber.js";

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
  workspace: string,
  number_of_admins: number,
  quorum?: number,
};

type Price = {
  amount: BigNumber,
};

export type Entity = Group | Account | User | Transaction;

export const userRoleMap = {
  ADMIN: "ADMIN",
  OPERATOR: "OPERATOR",
};
export type UserRole = $Keys<typeof userRoleMap>;

export type Unit = {
  id?: number,
  name: string,
  code: string,
  symbol?: string,
  magnitude: number,
  showAllDigits?: boolean,
};

export type Currency = {
  name: string,
  family: string,
  ticker: string,
  color: string,
  payment_uri_scheme: string,
  issue_message?: string,
  units: Unit[],
};
export type CurrencyEntity = Currency;

export type RateLimiter = {
  max_transaction: number,
  time_slot: number,
};

export type SecurityScheme = {
  quorum: number,
  time_lock?: number,
  rate_limiter?: RateLimiter,
  auto_expire?: number | null,
};

export type AccountSettings = {
  id: number,
  fiat: Fiat,
  currency_unit: Unit,
  unitIndex: number,
  blockchain_explorer: string,
};

type UserCommon = {
  id: number,
  pub_key: string,
  username: string,
  user_id?: string,
  picture?: string,
  created_on: string,
  status: string,
  email?: string,
  last_request?: Request,
  role: UserRole,
};
export type UserEntity = UserCommon;
export type User = UserCommon;

export type UserInvite = {
  id: string,
  is_complete: boolean,
  status: string,
  type: string,
  url_id: string,
  user: {
    id: string,
    role: string,
    key_handle: ?string,
    pub_key: ?string,
    username: string,
    created_on: string,
    user_id: string,
  },
};

export type Approval = {
  created_on: Date,
  created_by: User,
  type: "APPROVE" | "ABORT",
};

export type AccountType = "Ethereum" | "Bitcoin" | "ERC20";

type ExtendedPubKey = {
  public_key: string,
  chain_code: string,
};

export type TxApprovalStep = { quorum: number, group: $Shape<Group> };
type AccountCommon = {
  id: number,
  account_type: AccountType,
  contract_address: string,
  parent?: number,
  name: string,
  members: User[],
  settings: AccountSettings,
  security_scheme: SecurityScheme,
  balance: BigNumber,
  parent_balance?: BigNumber,
  number_of_approvals: number,
  created_on: Date,
  approvals: Approval[],
  fresh_addresses: *,
  hsm_operations?: Object,
  is_hsm_coin_app_updated: boolean,
  index: number,
  status: string,
  last_request?: Request,
  xpub: string,
  tx_approval_steps?: TxApprovalStep[],
  parent: ?number,
  derivation_path: string,
  extended_public_key: ExtendedPubKey,
};
export type Account = AccountCommon & {
  currency: string,
};

export type TransactionRecipientIsValid = {
  amount: number,
  recipient: string,
};

export type TransactionGetFees = {
  amount: BigNumber,
  recipient: string,
  fees_level?: string,
  gas_limit?: ?BigNumber,
  gas_price?: ?BigNumber,
  max_amount?: ?BigNumber,
};

export type AccountEntity = AccountCommon & {
  currency: string,
};

type GroupCommon = {
  id: number,
  name: string,
  created_on: Date,
  created_by: User,
  description?: string,
  last_request?: Request,
  status: string, // TODO create UNION type when different status are known
  is_internal: boolean,
};

export type GroupEntity = GroupCommon & {
  members: string[],
};

export type Group = GroupCommon & {
  members: User[],
  approvals: Approval[],
};

export type TransactionCreationNote = {
  title: string,
  content: string,
};

type NoteCommon = {
  id: string,
  title: string,
  content: string,
  created_at: string,
};

export type Note = NoteCommon & {
  created_by: User,
};

export type NoteEntity = NoteCommon & {
  created_by: string,
};

export type RawTransactionInput = {
  index: number,
  value: number,
  previous_tx_hash?: string,
  previous_tx_output_index?: number,
  address: string,
  signature_script?: string,
  coinbase?: string,
  sequence?: number,
};

export type RawTransactionOutput = {
  index: number,
  value: number,
  address: string,
  script?: string,
};

export type RawTransaction = {
  version: string,
  hash: string,
  lock_time: string,
  inputs: RawTransactionInput[],
  outputs: RawTransactionOutput[],
};

export type RawTransactionETH = {
  block: Object,
  height: number,
  time: string,
  date: string,
  gas_limit: number,
  gas_price: number,
  hash: string,
  receiver: string,
  sender: string,
  value: number,
};

export type TransactionType = "SEND" | "RECEIVE";

export type TransactionStatus =
  | "SUBMITTED"
  | "ABORTED"
  | "PENDING_APPROVAL"
  | "BLOCKED";

export type UserStatus =
  | "ACTIVE"
  | "ABORTED"
  | "REVOKED"
  | "PENDING_APPROVAL"
  | "PENDING_REVOCATION"
  | "PENDING_REGISTRATION"
  | "ACCESS_SUSPENDED";

export type GroupStatus = "PENDING" | "ACTIVE" | "REVOKED" | "ABORTED";

export type AccountStatus =
  | "ACTIVE"
  | "VIEW_ONLY"
  | "REVOKED"
  | "MIGRATED"
  | "VIEW_ONLY"
  | "HSM_COIN_UPDATED"
  | "PENDING"
  | "PENDING_UPDATE"
  | "PENDING_VIEW_ONLY"
  | "PENDING_CREATION_APPROVAL"
  | "PENDING_MIGRATED";

type TransactionCommon = {
  id: number,
  created_by: User,
  currency_family: string,
  confirmations: number,
  tx_hash: ?string,
  created_on: Date,
  price?: Price,
  fees: BigNumber,
  approvedTime: ?string,
  type: TransactionType,
  amount: BigNumber,
  account_id: string,
  approved: string[],
  senders: string[],
  recipient: string,
  recipients: string[],
  block_height?: number,
  time?: Date,
  transaction?: RawTransaction | RawTransactionETH,
  exploreURL: ?string,
  approvals: Approval[],
  tx_hash: ?string,
  status: TransactionStatus,
  hsm_operations?: Object,
  error?: Object,
  last_request?: Request,
  gas_price?: BigNumber,
  gas_limit?: BigNumber,
};

export type Transaction = TransactionCommon & {
  notes: Note[],
};

export type TransactionEntity = TransactionCommon & {
  notes: NoteEntity[],
};

export type ActivityCommon = {
  id: number,
  seen: boolean,
  show: boolean,
  created_on: Date,
};

export type ActivityGeneric = {
  id: number,
  seen: boolean,
  show: boolean,
  created_on: Date,
  business_action: ActivityEntityAccount | ActivityEntityTransaction,
};

export type ActivityEntityAccount = ActivityCommon & {
  business_action: {
    id: number,
    account: AccountEntity,
    author: UserCommon,
    business_action_name: string,
    message: string,
    target_id: number,
    target_type: string,
  },
};

export type ActivityEntityTransaction = ActivityCommon & {
  business_action: {
    id: number,
    transaction: *,
    author: UserCommon,
    business_action_name: string,
    message: string,
    target_id: number,
    target_type: string,
  },
};

export type GateError = {
  json: {
    message: string,
    name: string,
    code: number,
  },
  name: string,
  message: string,
  status: number,
};

export type ERC20Token = {
  blockchain_name: string,
  contract_address: string,
  network_id: number,
  decimals: number,
  name: string,
  ticker: string,
  signature: string,
  hsm_signature: string,
  hsm_account_parameters: string,
  disable_countervalue?: boolean,
};

export type MetaStatus = "APPROVED" | "PENDING" | "ABORTED";

export type RequestStatus =
  | "ABORTED"
  | "PENDING_APPROVAL"
  | "PENDING_REGISTRATION"
  | "APPROVED";

export const RequestActivityTypeDefs = {
  CREATE_GROUP: "CREATE_GROUP",
  EDIT_GROUP: "EDIT_GROUP",
  REVOKE_GROUP: "REVOKE_GROUP",
  REVOKE_USER: "REVOKE_USER",
  CREATE_ADMIN: "CREATE_ADMIN",
  CREATE_OPERATOR: "CREATE_OPERATOR",
  CREATE_ACCOUNT: "CREATE_ACCOUNT",
  EDIT_ACCOUNT: "EDIT_ACCOUNT",
  REVOKE_ACCOUNT: "REVOKE_ACCOUNT",
  MIGRATE_ACCOUNT: "MIGRATE_ACCOUNT",
  UPDATE_QUORUM: "UPDATE_QUORUM",
  CREATE_TRANSACTION: "CREATE_TRANSACTION",
};

export type RequestActivityType = $Keys<typeof RequestActivityTypeDefs>;

export const RequestActivityTypeList: RequestActivityType[] = Object.keys(
  RequestActivityTypeDefs,
);

export type RequestTargetType =
  | "GROUP"
  | "BITCOIN_ACCOUNT"
  | "ETHEREUM_ACCOUNT"
  | "ERC20_ACCOUNT"
  | "BITCOIN_LIKE_TRANSACTION"
  | "ETHEREUM_LIKE_TRANSACTION"
  | "PERSON"
  | "ORGANIZATION";

type RequestCommon = {
  created_by: User,
  created_on: string,
  id: number,
  status: string,
  type: string,
  approvals?: RequestApproval[],
  // TODO type this
  approvals_steps: any,
  current_step: number,
  target_id: number,
  url_id?: string,
  target_type: RequestTargetType,
  type: RequestActivityType,
  account?: RequestAccount,
  user?: RequestUser,
  transaction?: RequestTransaction,
  group?: RequestGroup,
  quorum?: number,
  organization?: Organization,
  expired_at: Date,
  edit_data?: *,
};

export type Request = RequestCommon;

type RequestApproval = {
  created_by: User,
  created_on: string,
  type: string,
  step: number,
};

type RequestUser = {
  created_on: string,
  id: number,
  key_handle: string,
  pub_key: string,
  status: string,
  user_id: string,
  username: string,
  role: UserRole,
};

type RequestTransaction = {
  account_id: number,
};

type RequestGroup = {
  name: string,
};

type RequestAccount = {
  name: string,
};

export type FreshAddress = {
  address: string,
  derivation_path: string,
};
