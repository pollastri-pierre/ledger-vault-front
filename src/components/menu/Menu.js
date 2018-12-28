//@flow
import { withStyles } from "@material-ui/core/styles";
import { Trans } from "react-i18next";
import React from "react";
import MenuList from "@material-ui/core/MenuList";

import MenuLink from "../MenuLink";
import AccountsMenu from "./AccountsMenu";
import PendingsMenuBadge from "./PendingsMenuBadge";
// import NewOperationModal from "../NewOperationModal";
import Receive from "components/Receive";
import Send from "components/Send";
import IconReceive from "components/icons/Receive";
import ModalRoute from "../ModalRoute";
import { getVisibleAccountsInMenu } from "utils/accounts";
import {
  isCreateOperationEnabled,
  getPendingsOperations
} from "utils/operations";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import type { Account, Operation } from "data/types";
import connectData from "restlay/connectData";
import SpinnerCard from "components/spinners/SpinnerCard";

import Home from "../icons/full/Home";
import Lines from "../icons/full/Lines";
import Search from "../icons/full/Search";
import Plus from "../icons/full/Plus";

const styles = {
  root: {
    position: "relative",
    width: "280px",
    float: "left",
    padding: "25px 35px 0 0"
  },
  link: {
    color: "black",
    textTransform: "uppercase"
  },
  icon: {
    width: 11,
    marginRight: "12px",
    verticalAlign: "baseline"
  },
  searchIcon: {
    width: 9,
    marginRight: "14px"
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
              <Home className={classes.icon} />
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
              <Plus className={classes.icon} />
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
              <Lines className={classes.icon} />
              <Trans i18nKey="menu:pending_requests" />
            </span>
          </MenuLink>
          <MenuLink to={`${match.url}/search`}>
            <span className={classes.link}>
              <Search className={classes.searchIcon} />
              <Trans i18nKey="menu:search" />
            </span>
          </MenuLink>
        </MenuList>
      </div>
      {visibleAccounts.length > 0 && (
        <div>
          <h4 className={classes.h4}>Accounts</h4>
          <div data-test="account_menu">
            <AccountsMenu location={location} accounts={visibleAccounts} />
          </div>
        </div>
      )}

      <ModalRoute
        path="*/new-operation"
        component={Send}
        // component={NewOperationModal}
        match={match}
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
