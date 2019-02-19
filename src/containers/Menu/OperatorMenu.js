// @flow
import React from "react";
import { Trans } from "react-i18next";
import MenuList from "@material-ui/core/MenuList";
import type { Match, Location } from "react-router-dom";
import type { Account, Operation } from "data/types";

import { getVisibleAccountsInMenu } from "utils/accounts";
import {
  getPendingsOperations,
  isCreateOperationEnabled
} from "utils/operations";

import { FaHome, FaMoneyCheck, FaExchangeAlt } from "react-icons/fa";

import Receive from "components/Receive";
import Send from "components/Send";
import IconReceive from "components/icons/Receive";
import IconSend from "components/icons/Send";
import Box from "components/base/Box";
import ModalRoute from "components/ModalRoute";

import MenuItem from "./MenuItem";

const ReceiveIcon = () => <IconReceive size={11} />;
const SendIcon = () => <IconSend size={11} />;
function OperatorMenu(props: {
  location: Location,
  match: Match,
  accounts: Array<Account>,
  allPendingOperations: Array<Operation>
}) {
  const { location, accounts, allPendingOperations, match } = props;
  const visibleAccounts = getVisibleAccountsInMenu(accounts);
  const pendingApprovalOperations = getPendingsOperations(allPendingOperations);

  return (
    <Box data-test="dashboard-operator-menu">
      <MenuList>
        <MenuItem to={`${match.url}/operator/dashboard`} Icon={FaHome}>
          <Trans i18nKey="menu:operator.dashboard" />
        </MenuItem>

        <MenuItem
          to={`${location.pathname}/new-operation`}
          dataTest="new-operation"
          disabled={
            !isCreateOperationEnabled(accounts, pendingApprovalOperations)
          }
          Icon={SendIcon}
        >
          <Trans i18nKey="menu:operator.send" />
        </MenuItem>

        <MenuItem
          to={`${location.pathname}/receive`}
          disabled={visibleAccounts.length === 0}
          Icon={ReceiveIcon}
        >
          <Trans i18nKey="menu:operator.receive" />
        </MenuItem>

        <MenuItem
          to={`${match.url}/operator/transactions`}
          Icon={FaExchangeAlt}
        >
          <Trans i18nKey="menu:operator.transactions" />
        </MenuItem>
        <MenuItem to={`${match.url}/operator/accounts`} Icon={FaMoneyCheck}>
          <Trans i18nKey="menu:operator.accounts" />
        </MenuItem>
      </MenuList>

      <ModalRoute
        path="*/new-operation"
        component={Send}
        match={match}
        disableBackdropClick
      />
      <ModalRoute
        path="*/receive"
        component={Receive}
        match={match}
        disableBackdropClick
      />
    </Box>
  );
}
export default OperatorMenu;
