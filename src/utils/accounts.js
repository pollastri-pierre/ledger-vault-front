//@flow

import type { Account, Member } from "data/types";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";

const ACCOUNT_MAX_LENGTH = 19;

const hasMoreThanAscii = str =>
  str.split("").some(function(char) {
    return char.charCodeAt(0) > 127;
  });

export const STATUS_UPDATE_IN_PROGRESS = "PENDING_UPDATE";
export const VISIBLE_MENU_STATUS = ["APPROVED", "PENDING_UPDATE"];
export const APPROVE = "APPROVE";

export const getAccountTitle = (account: Account) => `${account.name}`;

export const getOutdatedAccounts = (accounts: Account[]): Account[] =>
  accounts.filter(a => a.is_hsm_coin_app_updated === false);

export const isAccountOutdated = (account: Account) =>
  account.is_hsm_coin_app_updated === false;

export const getVisibleAccountsInMenu = (accounts: Account[]): Account[] =>
  accounts.filter(a => VISIBLE_MENU_STATUS.indexOf(a.status) > -1);

export const isAccountBeingUpdated = (account: Account) =>
  account.status === STATUS_UPDATE_IN_PROGRESS;

export const hasUserApprovedAccount = (account: Account, user: Member) => {
  const approvals = account.approvals.filter(
    approval => approval.type === APPROVE
  );
  return (
    approvals.filter(approval => approval.person.pub_key === user.pub_key)
      .length > 0
  );
};

export const isValidAccountName = (name: string) =>
  name.length < ACCOUNT_MAX_LENGTH && !hasMoreThanAscii(name);

export const getEthAccounts = (accounts: Account[]): Account[] =>
  accounts.filter(a => a.currency.name === "ethereum");

export const getAccountCurrencyName = (account: Account) => {
  if (account.account_type === "ERC20" && account.contract_address) {
    const token = getERC20TokenByContractAddress(account.contract_address);
    if (!token) {
      // TODO what should we return
      return "(?)";
    }
    return token.name;
  }
  return account.currency.name;
};
