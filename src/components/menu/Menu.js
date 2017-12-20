//@flow
import React from "react";
import PropTypes from "prop-types";
import { MenuList } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import MenuLink from "../MenuLink";
import AccountsMenu from "./AccountsMenu";
import PendingsMenuBadge from "./PendingsMenuBadge";
import NewOperationModal from "../NewOperationModal";
import ModalRoute from "../ModalRoute";
import {
  MenuDashboardIcon,
  MenuPendingIcon,
  MenuSearchIcon,
  MenuNewOperationIcon
} from "../icons";

const styles = {
  root: {
    position: "relative"
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
    top: 90,
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
function Menu(
  props: {
    location: Object,
    classes: Object
  },
  context: {
    translate: Function
  }
) {
  const { location, classes } = props;
  const t = context.translate;
  return (
    <div className={"Menu " + classes.root}>
      {/* hacky but we need the badge to leave outside the menu list so it's not focusable or with opacity */}
      <span className={classes.pendingMenuBadge}>
        <PendingsMenuBadge />
      </span>

      <MenuList>
        <MenuLink to="/dashboard">
          <span className={classes.link}>
            <MenuDashboardIcon className={classes.icon} />
            {t("menu.dashboard")}
          </span>
        </MenuLink>
        <MenuLink to={location.pathname + "/new-operation"}>
          <span className={classes.link}>
            <MenuNewOperationIcon className={classes.icon} />
            {t("menu.newOperation")}
          </span>
        </MenuLink>
        <MenuLink to="/pending">
          <span className={classes.link}>
            <MenuPendingIcon className={classes.icon} />
            {t("menu.pendingRequests")}
          </span>
        </MenuLink>
        <MenuLink to="/search">
          <span className={classes.link}>
            <MenuSearchIcon className={classes.searchIcon} />
            {t("menu.search")}
          </span>
        </MenuLink>
      </MenuList>

      <h4 className={classes.h4}>Accounts</h4>

      <AccountsMenu location={location} />

      <ModalRoute path="*/new-operation" component={NewOperationModal} />
    </div>
  );
}

Menu.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default withStyles(styles)(Menu);
