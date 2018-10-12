//@flow
import type { Account, Member } from "data/types";

export const STATUS_UPDATE_IN_PROGRESS = "PENDING_UPDATE";
export const VISIBLE_MENU_STATUS = ["APPROVED", "PENDING_UPDATE"];
export const APPROVE = "APPROVE";

export const getAccountTitle = (account: Account) =>
  `${account.name} #${account.index}`;

export const getOutdatedAccounts = (accounts: Account[]) =>
  accounts.filter(a => a.is_hsm_coin_app_updated === false);

export const isAccountOutdated = (account: Account) =>
  account.is_hsm_coin_app_updated === false;

export const getVisibleAccountsInMenu = (accounts: Account[]) =>
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
