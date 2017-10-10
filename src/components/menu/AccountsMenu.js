import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

function AccountsMenu(props) {
  const { accounts } = props;

  return (
    <ul className="accounts-menu-list">
      {_.map(accounts, account => {
        const url = `/account/${account.id}`;
        return (
          <li key={account.id}>
            <Link
              className={`${account.currency.name} ${props.pathname.startsWith(url) ? 'active' : ''}`}
              to={`/account/${account.id}`}
            >
              {account.name}
              <span className="unit">{account.currency.units[0]}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

AccountsMenu.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    currency: PropTypes.shape({}),
  })).isRequired,
  pathname: PropTypes.string.isRequired,
};

export default AccountsMenu;
