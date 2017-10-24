import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import currencies from '../../../currencies';

function AccountCreationCurrencies(props) {
  const { currency, onSelect } = props;

  return (
    <div className="account-creation-currencies wrapper">
      {_.map(currencies, cur => (
        <div
          onClick={() => onSelect(cur)}
          role="button"
          tabIndex="0"
          key={cur.units[0].name}
          className={`account-creation-currency
            ${cur.units[0].name
              .split(' ')
              .join('-')
              .toLowerCase()}
            ${currency && currency.units[0].name === cur.units[0].name
              ? 'selected'
              : ''}`}
        >
          <span className="currency-name">{cur.units[0].name}</span>
          <span className="currency-short">{cur.units[0].symbol}</span>
        </div>
      ))}
    </div>
  );
}

AccountCreationCurrencies.defaultProps = {
  currency: {}
};

AccountCreationCurrencies.propTypes = {
  onSelect: PropTypes.func.isRequired,
  currency: PropTypes.shape({
    name: PropTypes.string,
    shortname: PropTypes.string
  })
};

export default AccountCreationCurrencies;
