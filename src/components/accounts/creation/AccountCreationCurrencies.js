import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

function AccountCreationCurrencies(props) {
  const { currencies, currency, onSelect } = props;

  return (
    <div className="account-creation-currencies">
      {_.map(currencies, cur =>
        (<div
          onClick={() => onSelect(cur)}
          role="button"
          tabIndex="0"
          key={cur.name}
          className={`account-creation-currency
            ${cur.name.split(' ').join('-').toLowerCase()}
            ${(currency && currency.name === cur.name) ? 'selected' : ''}`}
        >
          <span className="currency-name">{cur.name}</span>
          <span className="currency-short">{cur.shortname}</span>
        </div>),
      )}
    </div>
  );
}

AccountCreationCurrencies.defaultProps = {
  currency: {},
};

AccountCreationCurrencies.propTypes = {
  onSelect: PropTypes.func.isRequired,
  currency: PropTypes.shape({
    name: PropTypes.string,
    shortname: PropTypes.string,
  }),
  currencies: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    shortname: PropTypes.string,
  })).isRequired,
};

export default AccountCreationCurrencies;
