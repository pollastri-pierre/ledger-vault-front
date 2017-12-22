//@flow
import React from "react";
import PropTypes from "prop-types";
import { MenuList } from "material-ui/Menu";
import MenuLink from "../MenuLink";
import AccountsMenu from "./AccountsMenu";
import PendingsMenuBadge from "./PendingsMenuBadge";
import NewOperationModal from "../NewOperationModal";
import ModalRoute from "../ModalRoute";
import common from "../../../src/shared/common";
import { withStyles } from "material-ui/styles";
import classnames from "classnames";
import colors from "../../../src/shared/colors";
import { mixinHoverSelected } from "../../../src/shared/common";

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
            <Home className={classes.icon} />
            {t("menu.dashboard")}
          </span>
        </MenuLink>
        <MenuLink to={location.pathname + "/new-operation"}>
          <span className={classes.link}>
            <Plus className={classes.icon} />
            {t("menu.newOperation")}
          </span>
        </MenuLink>
        <MenuLink to="/pending">
          <span className={classes.link}>
            <Lines className={classes.icon} />
            {t("menu.pendingRequests")}
          </span>
        </MenuLink>
        <MenuLink to="/search">
          <span className={classes.link}>
            <Search className={classes.searchIcon} />
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
