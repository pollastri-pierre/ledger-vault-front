//@flow
import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import AccountsMenu from "./AccountsMenu";
import PendingsMenuBadge from "./PendingsMenuBadge";
import NewOperationModal from "../NewOperationModal";
import ModalRoute from "../ModalRoute";
import injectSheet from "react-jss";
import common from "../../../src/shared/common";
import classnames from "classnames";
import colors from "../../../src/shared/colors";
import { mixinHoverSelected } from "../../../src/shared/common";

import {
  MenuDashboardIcon,
  MenuPendingIcon,
  MenuSearchIcon,
  MenuNewOperationIcon
} from "../icons";

const styles = {
  base: {
    width: "280px",
    float: "left",
    padding: "25px 35px 0 0",
    "& ul": {
      ...common.list
    }
  },
  base_menu: {
    "& li": {
      margin: "10px 0",
      height: "18.5px",
      position: "relative"
    },
    "& a": {
      fontWeight: "600",
      color: "black",
      paddingLeft: "40px",
      display: "block",
      textDecoration: "none",
      textTransform: "uppercase"
    }
  },
  main_menu: {
    "& a": {
      ...mixinHoverSelected(colors.ocean, "0"),
      fontSize: "11px"
    }
  },
  icon: {
    marginRight: "12px",
    verticalAlign: "baseline"
  },
  menu_accounts: {
    color: "black",
    fontSize: "13px",
    fontWweight: "400",
    marginBottom: "20px",
    marginTop: "40px",
    marginLeft: "40px",
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
    <div className={classes.base}>
      <ul className={classnames(classes.base_menu, classes.main_menu)}>
        <li>
          <NavLink to="/dashboard">
            <span className={classes.icon}>
              <MenuDashboardIcon />
            </span>
            {t("menu.dashboard")}
          </NavLink>
        </li>
        <li>
          <NavLink to={location.pathname + "/new-operation"}>
            <span className={classes.icon}>
              <MenuNewOperationIcon />
            </span>
            {t("menu.newOperation")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/pending">
            <span className={classes.icon}>
              <MenuPendingIcon />
            </span>
            {t("menu.pendingRequests")}
          </NavLink>{" "}
          <PendingsMenuBadge />
        </li>
        <li>
          <NavLink to="/search">
            <span className={classes.icon}>
              <MenuSearchIcon />
            </span>
            {t("menu.search")}
          </NavLink>
        </li>
      </ul>

      <div className={classes.base_menu}>
        <h4 className={classes.menu_accounts}>Accounts</h4>
        <AccountsMenu location={location} />
      </div>

      <ModalRoute path="*/new-operation" component={NewOperationModal} />
    </div>
  );
}

Menu.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default injectSheet(styles)(Menu);
