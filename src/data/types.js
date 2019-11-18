// @flow

import type { BigNumber } from "bignumber.js";
import type { RulesSet } from "components/MultiRules/types";

// This contains all the flow types for the Data Model (coming from the API)
// We have a little variation with the way client denormalize the data,
// therefore we will have _T_Entity types to be the denormalized form of _T_

export const mapRestlayKeyToType = {
  users: "USER",
  groups: "GROUP",
  accounts: "ACCOUNT",
  transactions: "TRANSACTION",
  whitelists: "WHITELIST",
};

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

export type Entity = Group | Account | User | Transaction | Whitelist;

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

export type AccountSettings = {
  id: number,
  fiat: Fiat,
  currency_unit: Unit,
  unitIndex: number,
  blockchain_explorer: string,
};

type UserCommon = {
  id: number,
  entityType: "USER",
  pub_key: string,
  username: string,
  user_id?: string,
  picture?: string,
  created_on: string,
  status: string,
  email?: string,
  role: UserRole,
};
export type User = UserCommon & {
  last_request?: Request<"USER">,
};

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
  created_on: string,
  created_by: User,
  type: "APPROVE" | "ABORT",
};

export type Address = {
  id: number,
  currency: string,
  address: string,
  name: string,
};
export type WhitelistCommon = {
  id: number,
  name: string,
  entityType: "WHITELIST",
  description: string,
  addresses: Address[],
  created_on: string,
  created_by: User,
  approvals: Approval[],
  status: string,
};

export type Whitelist = WhitelistCommon & {
  last_request?: Request<"WHITELIST">,
};

export type AccountType = "Ethereum" | "Bitcoin" | "Erc20" | "Ripple";

type ExtendedPubKey = {
  public_key: string,
  chain_code: string,
};

type AccountCommon = {
  id: number,
  account_type: AccountType,
  entityType: "ACCOUNT",
  // for xrp...
  address?: string,
  contract_address: string,
  name: string,
  settings: AccountSettings,
  balance: BigNumber,
  currency: string,
  parent_balance?: BigNumber,
  created_on: string,
  governance_rules: RulesSet[],
  fresh_addresses: *,
  is_hsm_coin_app_updated: boolean,
  index: number,
  status: AccountStatus,
  xpub: string,
  parent: ?number,
  derivation_path: string,
  extended_public_key: ExtendedPubKey,
};

export type Account = AccountCommon & {
  last_request?: Request<"ACCOUNT">,
};

export type TransactionRecipientIsValid = {
  amount: number,
  recipient: string,
};

export type TransactionGetFees = {
  amount?: BigNumber,
  recipient?: string,
  fees_level?: string,
  gas_limit?: ?BigNumber,
  gas_price?: ?BigNumber,
  max_amount?: ?BigNumber,
  memo?: [],
};

type GroupCommon = {
  id: number,
  name: string,
  entityType: "GROUP",
  created_on: string,
  created_by: User,
  description?: string,
  status: GroupStatus,
  is_internal: boolean,
  members: User[],
  is_under_edit: boolean,
};

export type Group = GroupCommon & {
  last_request?: Request<"GROUP">,
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

export const TransactionStatusMap = {
  SUBMITTED: "SUBMITTED",
  ABORTED: "ABORTED",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  BLOCKED: "BLOCKED",
};
export type TransactionStatus = $Keys<typeof TransactionStatusMap>;

export const UserStatusMap = {
  ACTIVE: "ACTIVE",
  ABORTED: "ABORTED",
  ACCESS_SUSPENDED: "ACCESS_SUSPENDED",
  REVOKED: "REVOKED",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  PENDING_REVOCATION: "PENDING_REVOCATION",
  PENDING_REGISTRATION: "PENDING_REGISTRATION",
};
export type UserStatus = $Keys<typeof UserStatusMap>;

export const GroupStatusMap = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  REVOKED: "REVOKED",
  ABORTED: "ABORTED",
};
export type GroupStatus = $Keys<typeof GroupStatusMap>;

export const AccountStatusMap = {
  ACTIVE: "ACTIVE",
  VIEW_ONLY: "VIEW_ONLY",
  REVOKED: "REVOKED",
  // FIXME does this status is a thing?
  MIGRATED: "MIGRATED",
  HSM_COIN_UPDATED: "HSM_COIN_UPDATED",
  PENDING: "PENDING",
  PENDING_UPDATE: "PENDING_UPDATE",
  PENDING_VIEW_ONLY: "PENDING_VIEW_ONLY",
  PENDING_MIGRATED: "PENDING_MIGRATED",
};
export type AccountStatus = $Keys<typeof AccountStatusMap>;

type TransactionCommon = {
  id: number,
  entityType: "TRANSACTION",
  created_by: User,
  currency_family: string,
  confirmations: number,
  min_confirmations: number,
  tx_hash: ?string,
  created_on: string,
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
  tx_hash: ?string,
  status: TransactionStatus,
  error?: Object,
  gas_price?: BigNumber,
  notes: Note[],
  gas_limit?: BigNumber,
  destination_tag?: number,
};

export type Transaction = TransactionCommon & {
  last_request?: Request<"TRANSACTION">,
};

export type TransactionEntity = TransactionCommon & {
  notes: NoteEntity[],
};

export type ActivityCommon = {
  id: number,
  seen: boolean,
  show: boolean,
  created_on: string,
};

export type ActivityGeneric = {
  id: number,
  seen: boolean,
  show: boolean,
  created_on: string,
  business_action: ActivityEntityAccount | ActivityEntityTransaction,
};

export type ActivityEntityAccount = ActivityCommon & {
  business_action: {
    id: number,
    account: Account,
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

export const MetaStatusMap = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  ABORTED: "ABORTED",
};
export type MetaStatus = $Keys<typeof MetaStatusMap>;

export const RequestStatusMap = {
  ABORTED: "ABORTED",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  PENDING_REGISTRATION: "PENDING_REGISTRATION",
  APPROVED: "APPROVED",
};
export type RequestStatus = $Keys<typeof RequestStatusMap>;

const RequestActivityTypeDefsWhitelist = {
  CREATE_WHITELIST: "CREATE_WHITELIST",
  EDIT_WHITELIST: "EDIT_WHITELIST",
  REVOKE_WHITELIST: "REVOKE_WHITELIST",
};
export const RequestActivityTypeDefsGroup = {
  CREATE_GROUP: "CREATE_GROUP",
  EDIT_GROUP: "EDIT_GROUP",
  REVOKE_GROUP: "REVOKE_GROUP",
};
const RequestActivityTypeDefsAccount = {
  CREATE_ACCOUNT: "CREATE_ACCOUNT",
  EDIT_ACCOUNT: "EDIT_ACCOUNT",
  REVOKE_ACCOUNT: "REVOKE_ACCOUNT",
  MIGRATE_ACCOUNT: "MIGRATE_ACCOUNT",
};
const RequestActivityTypeDefsUser = {
  REVOKE_USER: "REVOKE_USER",
  CREATE_ADMIN: "CREATE_ADMIN",
  CREATE_OPERATOR: "CREATE_OPERATOR",
};
const RequestActivityTypeDefsOrganization = {
  UPDATE_QUORUM: "UPDATE_QUORUM",
};
const RequestActivityTypeDefsTransaction = {
  CREATE_TRANSACTION: "CREATE_TRANSACTION",
};

export const RequestActivityTypeDefs = {
  ...RequestActivityTypeDefsWhitelist,
  ...RequestActivityTypeDefsGroup,
  ...RequestActivityTypeDefsAccount,
  ...RequestActivityTypeDefsUser,
  ...RequestActivityTypeDefsOrganization,
  ...RequestActivityTypeDefsTransaction,
};
export type RequestActivityType = $Keys<typeof RequestActivityTypeDefs>;

export const RequestActivityTypeList: RequestActivityType[] = Object.keys(
  RequestActivityTypeDefs,
);

const TargetTypeUserDefs = {
  PERSON: "PERSON",
};
const TargetTypeGroupDefs = {
  GROUP: "GROUP",
};
const TargetTypeWhitelistDefs = {
  WHITELIST: "WHITELIST",
};
export const GroupTargetTypeList: Array<
  $Keys<typeof TargetTypeGroupDefs>,
> = Object.keys(TargetTypeGroupDefs);

const TargetTypeAccountDefs = {
  BITCOIN_ACCOUNT: "BITCOIN_ACCOUNT",
  ETHEREUM_ACCOUNT: "ETHEREUM_ACCOUNT",
  RIPPLE_ACCOUNT: "RIPPLE_ACCOUNT",
  ERC20_ACCOUNT: "ERC20_ACCOUNT",
};
export const AccountTargetTypeList: Array<
  $Keys<typeof TargetTypeAccountDefs>,
> = Object.keys(TargetTypeAccountDefs);

const TargetTypeTransactionDefs = {
  BITCOIN_LIKE_TRANSACTION: "BITCOIN_LIKE_TRANSACTION",
  ETHEREUM_LIKE_TRANSACTION: "ETHEREUM_LIKE_TRANSACTION",
  RIPPLE_LIKE_TRANSACTION: "RIPPLE_LIKE_TRANSACTION",
};
export const TransactionTargetTypeList: Array<
  $Keys<typeof TargetTypeTransactionDefs>,
> = Object.keys(TargetTypeTransactionDefs);

const TargetTypeOrganizationDefs = {
  ORGANIZATION: "ORGANIZATION",
};
type TargetTypeUser = $Keys<typeof TargetTypeUserDefs>;
export type TargetTypeGroup = $Keys<typeof TargetTypeGroupDefs>;
type TargetTypeWhitelist = $Keys<typeof TargetTypeWhitelistDefs>;
type TargetTypeAccount = $Keys<typeof TargetTypeAccountDefs>;
type TargetTypeTransaction = $Keys<typeof TargetTypeTransactionDefs>;
type TargetTypeOrganization = $Keys<typeof TargetTypeOrganizationDefs>;

export type RequestTargetType =
  | TargetTypeUser
  | TargetTypeGroup
  | TargetTypeWhitelist
  | TargetTypeAccount
  | TargetTypeTransaction
  | TargetTypeOrganization;

export type EditApprovalStep = {
  group_id?: number,
  quorum: number,
  users?: number[],
};

type WhitelistEditData = {
  name?: string,
  addresses: number[],
};

type GroupEditData = {
  name?: string,
  members: number[],
};
type AccountEditData = {
  name?: string,
  governance_rules: RulesSet[],
};

type MapRequestType = {
  entity: {
    WHITELIST: Whitelist,
    GROUP: Group,
    ACCOUNT: Account,
    USER: User,
    TRANSACTION: Transaction,
    ORGANIZATION: Organization,
  },
  targetType: {
    WHITELIST: TargetTypeWhitelist,
    GROUP: TargetTypeGroup,
    ACCOUNT: TargetTypeAccount,
    USER: TargetTypeUser,
    TRANSACTION: TargetTypeTransaction,
    ORGANIZATION: TargetTypeOrganization,
  },
  type: {
    GROUP: $Keys<typeof RequestActivityTypeDefsGroup>,
    WHITELIST: $Keys<typeof RequestActivityTypeDefsWhitelist>,
    ACCOUNT: $Keys<typeof RequestActivityTypeDefsAccount>,
    USER: $Keys<typeof RequestActivityTypeDefsUser>,
    TRANSACTION: $Keys<typeof RequestActivityTypeDefsTransaction>,
    ORGANIZATION: $Keys<typeof RequestActivityTypeDefsOrganization>,
  },
  editData: {
    GROUP: GroupEditData,
    ACCOUNT: AccountEditData,
    WHITELIST: WhitelistEditData,
    // can't edit person/transaction/orga but flow want them to be defined
    USER: *,
    TRANSACTION: *,
    ORGANIZATION: *,
  },
};

export type Request<T> = {
  created_by: User,
  created_on: string,
  id: number,
  status: string,
  type: string,
  approvals?: RequestApproval[],
  approvals_steps: Array<{
    group: GroupCommon,
    quorum: number,
  }>,
  current_step: number,
  target_id: number,
  url_id?: string,
  target_type: $ElementType<$PropertyType<MapRequestType, "targetType">, T>,
  type: $ElementType<$PropertyType<MapRequestType, "type">, T>,
  account?: AccountCommon,
  user?: UserCommon,
  transaction?: TransactionCommon,
  group?: GroupCommon,
  quorum?: number,
  organization?: Organization,
  expired_at: Date,
  edit_data?: $ElementType<$PropertyType<MapRequestType, "editData">, T>,
};

export type GenericRequest =
  | Request<"USER">
  | Request<"ACCOUNT">
  | Request<"GROUP">
  | Request<"TRANSACTION">
  | Request<"WHITELIST">
  | Request<"ORGANIZATION">;

type RequestApproval = {
  created_by: User,
  created_on: string,
  type: string,
  step: number,
};

export type FreshAddress = {
  address: string,
  derivation_path: string,
};
