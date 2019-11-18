// @flow

import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import type { Account } from "data/types";

export const STATUS_UPDATE_IN_PROGRESS = "PENDING_UPDATE";
export const VISIBLE_MENU_STATUS = ["ACTIVE", "PENDING_UPDATE", "VIEW_ONLY"];
export const APPROVE = "APPROVE";

export const isAccountOutdated = (account: Account) =>
  account.is_hsm_coin_app_updated === false;

export const getVisibleAccountsInMenu = (accounts: Account[]): Account[] =>
  accounts.filter(a => VISIBLE_MENU_STATUS.indexOf(a.status) > -1);

export const isAccountBeingUpdated = (account: Account) =>
  account.last_request &&
  account.last_request.type === "EDIT_ACCOUNT" &&
  account.last_request.status === "PENDING_APPROVAL";

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

export const isBalanceAvailable = (account: Account) => {
  // This seems to work for eth/token/btc like account, what about XRP?
  return !!account.extended_public_key;
};
