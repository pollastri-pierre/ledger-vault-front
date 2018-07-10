//@flow
import SpinnerCard from "components/spinners/SpinnerCard";
import { translate } from "react-i18next";
import type { Translate } from "data/types";
import { getPendingsOperations } from "utils/operations";
import React from "react";
// import AccountsQuery from "api/queries/AccountsQuery";
import { isCreateOperationEnabled } from "utils/operations";
import CurrenciesQuery from "api/queries/CurrenciesQuery";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import type { Account, Operation } from "data/types";
import connectData from "restlay/connectData";
import MenuList from "@material-ui/core/MenuList";
import MenuLink from "../MenuLink";
import AccountsMenu from "./AccountsMenu";
import PendingsMenuBadge from "./PendingsMenuBadge";
import NewOperationModal from "../NewOperationModal";
import ModalRoute from "../ModalRoute";
import { withStyles } from "@material-ui/core/styles";

import Home from "../icons/full/Home";
import Lines from "../icons/full/Lines";
// import Search from "../icons/full/Search";
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
    top: 95,
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
  t: Translate,
  allPendingOperations: Array<Operation>
}) {
  const { location, classes, accounts, allPendingOperations, match, t } = props;
  const pendingApprovalOperations = getPendingsOperations(allPendingOperations);
  return (
    <div className={classes.root}>
      {/* hacky but we need the badge to leave outside the menu list so it's not focusable or with opacity */}
      <span className={classes.pendingMenuBadge}>
        <PendingsMenuBadge />
      </span>

      <MenuList>
        <MenuLink to={`${match.url}/dashboard`}>
          <span className={classes.link}>
            <Home className={classes.icon} />
            {t("menu:dashboard")}
          </span>
        </MenuLink>
        <MenuLink
          to={`${location.pathname}/new-operation`}
          disabled={
            !isCreateOperationEnabled(accounts, pendingApprovalOperations)
          }
        >
          <span className={classes.link}>
            <Plus className={classes.icon} />
            {t("menu:new_operation")}
          </span>
        </MenuLink>
        <MenuLink to={`${match.url}/pending`}>
          <span className={classes.link}>
            <Lines className={classes.icon} />
            {t("menu:pending_requests")}
          </span>
        </MenuLink>
        {/* <MenuLink to={`${match.url}/search`}> */}
        {/*   <span className={classes.link}> */}
        {/*     <Search className={classes.searchIcon} /> */}
        {/*     {t("menu.search")} */}
        {/*   </span> */}
        {/* </MenuLink> */}
      </MenuList>

      {accounts.length > 0 && (
        <div>
          <h4 className={classes.h4}>Accounts</h4>
          <AccountsMenu location={location} accounts={accounts} />
        </div>
      )}

      <ModalRoute
        path="*/new-operation"
        component={NewOperationModal}
        match={match}
      />
    </div>
  );
}

const RenderLoading = withStyles(styles)(({ classes }) => (
  <div className={classes.root} style={{ paddingTop: 100 }}>
    <SpinnerCard />
  </div>
));

export default connectData(withStyles(styles)(translate()(Menu)), {
  RenderLoading,
  queries: {
    allPendingOperations: PendingOperationsQuery,
    currencies: CurrenciesQuery
  }
});
