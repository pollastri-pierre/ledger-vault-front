//@flow
import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
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
import "./Menu.css";

const styleIcon = { marginRight: "12px", verticalAlign: "baseline" };
function Menu(
  props: {
    location: Object
  },
  context: {
    translate: Function
  }
) {
  const { location } = props;
  const t = context.translate;
  return (
    <div className="Menu">
      <ul className="main-menu">
        <li>
          <NavLink to="/dashboard">
            <MenuDashboardIcon style={styleIcon} />
            {t("menu.dashboard")}
          </NavLink>
        </li>
        <li>
          <NavLink to={location.pathname + "/new-operation"}>
            <MenuNewOperationIcon style={styleIcon} />
            {t("menu.newOperation")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/pending">
            <MenuPendingIcon style={styleIcon} />
            {t("menu.pendingRequests")}
          </NavLink>{" "}
          <PendingsMenuBadge />
        </li>
        <li>
          <NavLink to="/search">
            <MenuSearchIcon style={{ marginRight: "15px" }} />
            {t("menu.search")}
          </NavLink>
        </li>
      </ul>

      <div className="menu-accounts">
        <h4>Accounts</h4>
        <AccountsMenu location={location} />
      </div>

      <ModalRoute path="*/new-operation" component={NewOperationModal} />
    </div>
  );
}

Menu.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default Menu;
