import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

function OperationCreationAccounts(props) {
  const { accounts, account, onSelect } = props;

  console.log(accounts);

  return (
    <div className="operation-creation-accounts wrapper">
      {_.map(accounts, cur =>
        (<div
          onClick={() => onSelect(cur)}
          role="button"
          tabIndex="0"
          key={cur.id}
          className={`operation-creation-account
            ${cur.name.split(' ').join('-').toLowerCase()}
            ${(account && account.name === cur.name) ? 'selected' : ''}`}
        >
          <span className="account-name">{cur.name}</span>
        </div>),
      )}
    </div>
  );
}

OperationCreationAccounts.defaultProps = {
  account: {},
};

OperationCreationAccounts.propTypes = {
  onSelect: PropTypes.func.isRequired,
  // accounts: PropTypes.shape({}).isRequired,
  account: PropTypes.shape({}),
};

export default OperationCreationAccounts;
