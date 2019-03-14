// @flow
import React from "react";
import { Trans } from "react-i18next";
import MenuList from "@material-ui/core/MenuList";
import type { Match } from "react-router-dom";

import {
  FaHome,
  FaList,
  FaUser,
  FaUsers,
  FaMoneyCheck,
  FaExchangeAlt
} from "react-icons/fa";

import Box from "components/base/Box";
import PendingBadge from "containers/Admin/Dashboard/PendingBadge";
import PendingsMenuBadge from "./PendingsMenuBadge";

import MenuItem from "./MenuItem";

function AdminMenu(props: { match: Match }) {
  const { match } = props;
  return (
    <Box data-test="dashboard-admin-menu">
      <MenuList>
        <Box horizontal align="center">
          <MenuItem to={`${match.url}/admin/dashboard`} Icon={FaHome}>
            <Trans i18nKey="menu:admin.dashboard" />
          </MenuItem>
          <PendingBadge />
        </Box>
        <Box horizontal align="center">
          <MenuItem to={`${match.url}/admin/tasks`} Icon={FaList}>
            <Trans i18nKey="menu:admin.tasks" />
          </MenuItem>
          <PendingsMenuBadge />
        </Box>
        <MenuItem to={`${match.url}/admin/groups`} Icon={FaUsers}>
          <Trans i18nKey="menu:admin.groups" />
        </MenuItem>
        <MenuItem to={`${match.url}/admin/users`} Icon={FaUser}>
          <Trans i18nKey="menu:admin.users" />
        </MenuItem>
        <MenuItem to={`${match.url}/admin/accounts`} Icon={FaMoneyCheck}>
          <Trans i18nKey="menu:admin.accounts" />
        </MenuItem>
        <MenuItem to={`${match.url}/admin/transactions`} Icon={FaExchangeAlt}>
          <Trans i18nKey="menu:admin.transactions" />
        </MenuItem>
      </MenuList>
    </Box>
  );
}

export default AdminMenu;
