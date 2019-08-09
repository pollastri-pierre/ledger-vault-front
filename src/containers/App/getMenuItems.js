// @flow

import React from "react";
import { Trans } from "react-i18next";
import { matchPath } from "react-router";
import type { Match, Location } from "react-router-dom";
import {
  FaHome,
  FaList,
  FaUser,
  FaUsers,
  FaMoneyCheck,
  FaExchangeAlt,
} from "react-icons/fa";

import { getVisibleAccountsInMenu } from "utils/accounts";
import {
  getPendingsTransactions,
  isCreateTransactionEnabled,
} from "utils/transactions";
import PendingBadge from "containers/Admin/Dashboard/PendingBadge";
import IconSend from "components/icons/Send";
import IconReceive from "components/icons/Receive";
import type { Account, Transaction } from "data/types";
import type { MenuItem } from "components/VaultLayout/types";

import { defaultStatuses as requestsStatuses } from "components/filters/RequestsFilters";
import { defaultStatuses as groupsStatuses } from "components/filters/GroupsFilters";
import { defaultStatuses as usersStatuses } from "components/filters/UsersFilters";
import { defaultStatuses as accountsStatuses } from "components/filters/AccountsFilters";
import { defaultStatuses as transactionsStatuses } from "components/filters/TransactionsFilters";

const SendIcon = () => <IconSend size={11} />;
const ReceiveIcon = () => <IconReceive size={11} />;

type Props = {
  role: string,
  match: Match,
  location: Location,
  accounts: Account[],
  allPendingTransactions: Transaction[],
};

export default function getMenuItems(props: Props) {
  const { match, role, accounts, allPendingTransactions, location } = props;
  if (role === "ADMIN") {
    return setActive(location, [
      {
        key: "dashboard",
        dataTest: "menuItem-dashboard",
        label: <Trans i18nKey="menu:admin.dashboard" />,
        url: `${match.url}/admin/dashboard`,
        Icon: FaHome,
        NotifComponent: PendingBadge,
      },
      {
        key: "admin-tasks",
        dataTest: "menuItem-admin-tasks",
        label: <Trans i18nKey="menu:admin.tasks" />,
        url: `${match.url}/admin/tasks`,
        query: { status: requestsStatuses },
        Icon: FaList,
      },
      {
        key: "groups",
        dataTest: "menuItem-groups",
        label: <Trans i18nKey="menu:admin.groups" />,
        url: `${match.url}/admin/groups`,
        query: { status: groupsStatuses },
        Icon: FaUsers,
      },
      {
        key: "users",
        dataTest: "menuItem-users",
        label: <Trans i18nKey="menu:admin.users" />,
        url: `${match.url}/admin/users`,
        query: { status: usersStatuses },
        Icon: FaUser,
      },
      {
        key: "accounts",
        dataTest: "menuItem-accounts",
        label: <Trans i18nKey="menu:admin.accounts" />,
        url: `${match.url}/admin/accounts`,
        query: { meta_status: accountsStatuses },
        Icon: FaMoneyCheck,
      },
      {
        key: "transactions",
        dataTest: "menuItem-transactions",
        label: <Trans i18nKey="menu:admin.transactions" />,
        url: `${match.url}/admin/transactions`,
        query: { status: transactionsStatuses },
        Icon: FaExchangeAlt,
      },
    ]);
  }
  if (role === "OPERATOR") {
    const visibleAccounts = getVisibleAccountsInMenu(accounts);
    const pendingApprovalTransactions = getPendingsTransactions(
      allPendingTransactions,
    );
    return setActive(location, [
      {
        key: "dashboard",
        dataTest: "menuItem-dashboard",
        label: <Trans i18nKey="menu:operator.dashboard" />,
        url: `${match.url}/operator/dashboard`,
        Icon: FaHome,
        NotifComponent: PendingBadge,
      },
      {
        key: "new-transaction",
        dataTest: "menuItem-new-transaction",
        label: <Trans i18nKey="menu:operator.send" />,
        url: `${location.pathname}/send`,
        Icon: SendIcon,
        isDisabled: !isCreateTransactionEnabled(
          accounts,
          pendingApprovalTransactions,
        ),
      },
      {
        key: "receive",
        dataTest: "menuItem-receive",
        label: <Trans i18nKey="menu:operator.receive" />,
        url: `${location.pathname}/receive`,
        Icon: ReceiveIcon,
        isDisabled: visibleAccounts.length === 0,
      },
      {
        key: "accounts",
        dataTest: "menuItem-accounts",
        label: <Trans i18nKey="menu:operator.accounts" />,
        url: `${match.url}/operator/accounts`,
        query: { meta_status: accountsStatuses },
        Icon: FaMoneyCheck,
      },
      {
        key: "transactions",
        dataTest: "menuItem-transactions",
        label: <Trans i18nKey="menu:operator.transactions" />,
        url: `${match.url}/operator/transactions`,
        query: { status: transactionsStatuses },
        Icon: FaExchangeAlt,
      },
    ]);
  }
  return [];
}

function setActive(location: Location, items: MenuItem[]): MenuItem[] {
  return items.map(item => ({
    ...item,
    isActive: matchPath(location.pathname, item.url),
  }));
}
