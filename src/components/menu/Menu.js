import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AccountsMenu from "./AccountsMenu";

import "./Menu.css";

function Menu(props, context) {
  const t = context.translate;

  const { pathname } = props;

  return (
    <div className="Menu">
      <ul className="main-menu">
        <li>
          <Link to="/" className={`${props.pathname === "/" ? "active" : ""}`}>
            <i className="material-icons">home</i> {t("menu.dashboard")}
          </Link>
        </li>
        <li>
          <a
            href="#"
            className={`${props.pathname === "/new" ? "active" : ""}`}
            onClick={
              // TODO make a button that is connected to redux and do not need this openOperation cb
              // TODO ideally this should use react-router with /operations/new (bookmarkable & no need to have redux)
              props.openOperation
            }
          >
            <i className="material-icons">add</i> {t("menu.newOperation")}
          </a>
        </li>
        <li>
          <Link
            to="/pending"
            className={`${props.pathname === "/pending" ? "active" : ""}`}
          >
            <i className="material-icons">format_align_left</i>{" "}
            {t("menu.pendingRequests")}
          </Link>{" "}
          <span className="menu-badge">2</span>
        </li>
        <li>
          <Link
            to="/search"
            className={`${props.pathname === "/search" ? "active" : ""}`}
          >
            <i className="material-icons">search</i> {t("menu.search")}
          </Link>
        </li>

        {/* Test page */}
        {/* <li><Link to="/sandbox" className={`${props.pathname === '/sandbox' ? 'active' : ''}`}><i className="material-icons">beach_access</i> sandbox</Link></li> */}
      </ul>

      <div className="menu-accounts">
        <h4>Accounts</h4>
        <AccountsMenu pathname={pathname} />
      </div>
    </div>
  );
}

Menu.contextTypes = {
  translate: PropTypes.func.isRequired
};

Menu.propTypes = {
  pathname: PropTypes.string.isRequired,
  openOperation: PropTypes.func.isRequired
};

export default Menu;
