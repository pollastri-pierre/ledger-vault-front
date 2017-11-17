//@flow
import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import AccountsMenu from "./AccountsMenu";
import PendingsMenuBadge from "./PendingsMenuBadge";
import NewOperationModal from "../NewOperationModal";
import ModalRoute from "../ModalRoute";
import "./Menu.css";

function Menu(
  props: {
    location: Object
  },
  context: {
    translate: Function
  }
) {
  const t = context.translate;
  return (
    <div className="Menu">
      <ul className="main-menu">
        <li>
          <NavLink to="/dashboard">
            <i className="material-icons">home</i> {t("menu.dashboard")}
          </NavLink>
        </li>
        <li>
          <NavLink to={props.location.pathname + "/new-operation"}>
            <i className="material-icons">add</i> {t("menu.newOperation")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/pending">
            <i className="material-icons">format_align_left</i>{" "}
            {t("menu.pendingRequests")}
          </NavLink>{" "}
          <PendingsMenuBadge />
        </li>
        <li>
          <NavLink to="/search">
            <i className="material-icons">search</i> {t("menu.search")}
          </NavLink>
        </li>
      </ul>

      <div className="menu-accounts">
        <h4>Accounts</h4>
        <AccountsMenu />
      </div>

      <ModalRoute path="*/new-operation" component={NewOperationModal} />
    </div>
  );
}

Menu.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default withRouter(Menu);
