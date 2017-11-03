import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import AccountsMenu from "./AccountsMenu";
import { openModalOperation } from "../../redux/modules/operation-creation";

import "./Menu.css";

const mapStateToProps = () => ({});

// TODO we can use more react router for this
const mapDispatchToProps = dispatch => ({
  openOperation: () => dispatch(openModalOperation())
});

function Menu(props, context) {
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
          <NavLink to="new-operation" onClick={props.openOperation}>
            <i className="material-icons">add</i> {t("menu.newOperation")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/pending">
            <i className="material-icons">format_align_left</i>{" "}
            {t("menu.pendingRequests")}
          </NavLink>{" "}
          <span className="menu-badge">2</span>
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
    </div>
  );
}

Menu.contextTypes = {
  translate: PropTypes.func.isRequired
};

Menu.propTypes = {
  openOperation: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
