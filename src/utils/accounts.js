//@flow
import type { Account } from "data/types";

const STATUS_ACCOUNT_OUTDATED = "APPROVED";

export const getAccountTitle = (account: Account) =>
  `${account.name} #${account.index}`;

export const getOutdatedAccounts = (accounts: Account[]) =>
  accounts.filter(a => a.is_hsm_coin_app_updated === false);

export const isAccountOutdated = (account: Account) =>
  account.is_hsm_coin_app_updated === false;
