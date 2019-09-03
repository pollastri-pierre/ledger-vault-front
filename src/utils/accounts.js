// @flow

import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import type { Account, User, TxApprovalStep } from "data/types";
import type { ApprovalsRule } from "components/ApprovalsRules";

const ACCOUNT_MAX_LENGTH = 19;

const hasMoreThanAscii = str =>
  str.split("").some(char => char.charCodeAt(0) > 127);

export const STATUS_UPDATE_IN_PROGRESS = "PENDING_UPDATE";
export const VISIBLE_MENU_STATUS = ["ACTIVE", "PENDING_UPDATE", "VIEW_ONLY"];
export const APPROVE = "APPROVE";

export const getAccountTitle = (account: Account) => `${account.name}`;

export const getOutdatedAccounts = (accounts: Account[]): Account[] =>
  accounts.filter(a => a.is_hsm_coin_app_updated === false);

export const isAccountOutdated = (account: Account) =>
  account.is_hsm_coin_app_updated === false;

export const getVisibleAccountsInMenu = (accounts: Account[]): Account[] =>
  accounts.filter(a => VISIBLE_MENU_STATUS.indexOf(a.status) > -1);

export const isAccountBeingUpdated = (account: Account) =>
  account.last_request &&
  account.last_request.type === "EDIT_ACCOUNT" &&
  account.last_request.status === "PENDING_APPROVAL";

export const hasUserApprovedAccount = (account: Account, user: User) => {
  const approvals = account.approvals.filter(
    approval => approval.type === APPROVE,
  );
  return (
    approvals.filter(approval => approval.created_by.pub_key === user.pub_key)
      .length > 0
  );
};

export const isValidAccountName = (name: string) =>
  name.length <= ACCOUNT_MAX_LENGTH && !hasMoreThanAscii(name);

export const getAccountsInSettings = (accounts: Account[]): Account[] =>
  accounts.filter(a => a.account_type !== "ERC20");

export const getAccountCurrencyName = (account: Account) => {
  if (account.account_type === "Erc20" && account.contract_address) {
    const token = getERC20TokenByContractAddress(account.contract_address);
    if (!token) {
      // TODO what should we return
      return "(?)";
    }
    return token.name;
  }
  const currency = getCryptoCurrencyById(account.currency);
  if (!currency) {
    return "(?)";
  }
  return currency.name;
};

/**
 * For now we assume that we need to filter only unsupported
 * erc20 accounts, because of airdrops.
 *
 * relatable: LV-1004
 */
export const isSupportedAccount = (account: Account) => {
  if (account.account_type === "Erc20") {
    const token = getERC20TokenByContractAddress(account.contract_address);
    return !!token;
  }
  return true;
};

// from full object to arrays of id
export const deserializeApprovalSteps = (
  tx_approval_steps: TxApprovalStep[],
): Array<?ApprovalsRule> =>
  tx_approval_steps.map(rule =>
    rule
      ? {
          quorum: rule.quorum,
          group_id: rule.group.is_internal ? null : rule.group.id,
          users: rule.group.is_internal
            ? rule.group.members.map(m => m.id)
            : [],

          // /!\ Hack
          //
          // the gate send us the whole users objects, which is good news
          // in this specific case, because operator can't normally see
          // them (because of access control). For some reason they are here.
          //
          // see https://ledgerhq.atlassian.net/browse/LV-1798
          // for more infos
          //
          rawUsers: rule.group.is_internal ? rule.group.members : [],
        }
      : null,
  );

export const isBalanceAvailable = (account: Account) => {
  // This seems to work for eth/token/btc like account, what about XRP?
  return !!account.extended_public_key;
};
