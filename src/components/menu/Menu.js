//@flow
import React from "react";
import PropTypes from "prop-types";
import { MenuList } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import { ListItemSecondaryAction } from "material-ui/List";
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
  secondaryAction: {
    padding: "10px 0",
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
    <div className="Menu">
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
          <ListItemSecondaryAction className={classes.secondaryAction}>
            <PendingsMenuBadge />
          </ListItemSecondaryAction>
        </MenuLink>
        <MenuLink to="/search">
          <span className={classes.link}>
            <MenuSearchIcon className={classes.searchIcon} />
            {t("menu.search")}
          </span>
        </MenuLink>
        <h4 className={classes.h4}>Accounts</h4>
        <AccountsMenu location={location} />
      </MenuList>

      <ModalRoute path="*/new-operation" component={NewOperationModal} />
    </div>
  );
}

Menu.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default withStyles(styles)(Menu);
