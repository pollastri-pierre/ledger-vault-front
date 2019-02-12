// @flow
import { withStyles } from "@material-ui/core/styles";
import { Trans } from "react-i18next";
import React, { Fragment } from "react";
import MenuList from "@material-ui/core/MenuList";
import { FaRegClock, FaHome, FaPlus, FaSearch } from "react-icons/fa";

import Receive from "components/Receive";
import Send from "components/Send";
import IconReceive from "components/icons/Receive";
import { getVisibleAccountsInMenu } from "utils/accounts";
import {
  isCreateOperationEnabled,
  getPendingsOperations
} from "utils/operations";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import type { Account, Operation } from "data/types";
import connectData from "restlay/connectData";
import SpinnerCard from "components/spinners/SpinnerCard";
import ModalRoute from "../ModalRoute";
import PendingsMenuBadge from "./PendingsMenuBadge";
import AccountsMenu from "./AccountsMenu";
import MenuLink from "../MenuLink";

const styles = {
  root: {
    position: "relative",
    width: 280,
    float: "left",
    padding: "25px 35px 0 0"
  },
  link: {
    color: "black",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "inherit"
  },
  icon: {
    marginRight: 12
  },
  pendingMenuBadge: {
    position: "absolute",
    right: 40,
    top: 124,
    pointerEvents: "none"
  },
  h4: {
    color: "black",
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 20,
    marginTop: 40,
    marginLeft: 40,
    textTransform: "uppercase"
  }
};
function Menu(props: {
  location: *,
  match: *,
  classes: { [_: $Keys<typeof styles>]: string },
  accounts: Array<Account>,
  allPendingOperations: Array<Operation>
}) {
  const { location, classes, accounts, allPendingOperations, match } = props;
  const pendingApprovalOperations = getPendingsOperations(allPendingOperations);
  const visibleAccounts = getVisibleAccountsInMenu(accounts);
  const viewOnlyAccounts = visibleAccounts.filter(
    a => a.status === "VIEW_ONLY"
  );
  const fullAccounts = visibleAccounts.filter(a => a.status !== "VIEW_ONLY");
  return (
    <div className={classes.root}>
      {/* hacky but we need the badge to leave outside the menu list so it's not focusable or with opacity */}
      <span className={classes.pendingMenuBadge}>
        <PendingsMenuBadge />
      </span>

      <div data-test="dashboard-menu">
        <MenuList>
          <MenuLink to={`${match.url}/dashboard`}>
            <span className={classes.link}>
              <FaHome className={classes.icon} />
              <Trans i18nKey="menu:dashboard" />
            </span>
          </MenuLink>
          <MenuLink
            to={`${location.pathname}/new-operation`}
            data-test="new-operation"
            disabled={
              !isCreateOperationEnabled(accounts, pendingApprovalOperations)
            }
          >
            <span className={classes.link}>
              <FaPlus className={classes.icon} />
              <Trans i18nKey="menu:new_operation" />
            </span>
          </MenuLink>
          <MenuLink
            to={`${location.pathname}/receive`}
            disabled={visibleAccounts.length === 0}
          >
            <span className={classes.link}>
              <IconReceive size={11} className={classes.icon} />
              <Trans i18nKey="menu:receive" />
            </span>
          </MenuLink>
          <MenuLink to={`${match.url}/pending`}>
            <span className={classes.link}>
              <FaRegClock className={classes.icon} />
              <Trans i18nKey="menu:pending_requests" />
            </span>
          </MenuLink>
          <MenuLink to={`${match.url}/search`}>
            <span className={classes.link}>
              <FaSearch className={classes.icon} />
              <Trans i18nKey="menu:search" />
            </span>
          </MenuLink>
        </MenuList>
      </div>
      {visibleAccounts.length > 0 && (
        <div>
          {fullAccounts.length > 0 && (
            <Fragment>
              <h4 className={classes.h4}>Accounts</h4>
              <div data-test="account_menu">
                <AccountsMenu location={location} accounts={fullAccounts} />
              </div>
            </Fragment>
          )}
          {viewOnlyAccounts.length > 0 && (
            <Fragment>
              <h4 className={classes.h4}>Read-only Accounts</h4>
              <div data-test="account_menu">
                <AccountsMenu location={location} accounts={viewOnlyAccounts} />
              </div>
            </Fragment>
          )}
        </div>
      )}

      <ModalRoute
        path="*/new-operation"
        component={Send}
        match={match}
        disableBackdropClick
      />
      <ModalRoute path="*/receive" component={Receive} match={match} />
    </div>
  );
}

const RenderLoading = withStyles(styles)(({ classes }) => (
  <div className={classes.root} style={{ paddingTop: 100 }}>
    <SpinnerCard />
  </div>
));

export default connectData(withStyles(styles)(Menu), {
  RenderLoading,
  queries: {
    allPendingOperations: PendingOperationsQuery
  }
});
