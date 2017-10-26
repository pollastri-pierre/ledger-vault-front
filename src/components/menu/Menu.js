import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SpinnerAccounts } from '../../components';
import AccountsMenu from './AccountsMenu';

import './Menu.css';

function Menu(props, context) {
  const t = context.translate;

  const { accounts, getAccounts, pathname } = props;

  if (!accounts.accounts && !accounts.isLoadingAccounts) {
    getAccounts();
  }

  return (
    <div className="Menu">
      <ul className="main-menu">
        <li>
          <Link to="/" className={`${props.pathname === '/' ? 'active' : ''}`}>
            <i className="material-icons">home</i> {t('menu.dashboard')}
          </Link>
        </li>
        <li>
          <a
            href="#"
            className={`${props.pathname === '/new' ? 'active' : ''}`}
            onClick={props.openOperation}
          >
            <i className="material-icons">add</i> {t('menu.newOperation')}
          </a>
        </li>
        <li>
          <Link to="/pending" className={`${props.pathname === '/pending' ? 'active' : ''}`}>
            <i className="material-icons">format_align_left</i> {t('menu.pendingRequests')}
          </Link>{' '}
          <span className="menu-badge">2</span>
        </li>
        <li>
          <Link to="/search" className={`${props.pathname === '/search' ? 'active' : ''}`}>
            <i className="material-icons">search</i> {t('menu.search')}
          </Link>
        </li>

        {/* Test page */}
        {/* <li><Link to="/sandbox" className={`${props.pathname === '/sandbox' ? 'active' : ''}`}><i className="material-icons">beach_access</i> sandbox</Link></li> */}
      </ul>

      <div className="menu-accounts">
        <h4>Accounts</h4>
        {accounts.isLoadingAccounts ? <SpinnerAccounts /> : false}
        {accounts.accounts && accounts.accounts.length > 0 ? (
          <AccountsMenu accounts={accounts.accounts} pathname={pathname} />
        ) : (
          false
        )}
      </div>
    </div>
  );
}

Menu.contextTypes = {
  translate: PropTypes.func.isRequired,
};

Menu.propTypes = {
  accounts: PropTypes.shape({}).isRequired,
  getAccounts: PropTypes.func.isRequired,
  openOperation: PropTypes.func.isRequired,
};

export default Menu;
