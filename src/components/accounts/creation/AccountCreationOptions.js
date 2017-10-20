import React from 'react';
import PropTypes from 'prop-types';

function AccountCreationOptions(props) {
  const classe = props.currency.units[0].name.split(' ')
    .join('-')
    .toLowerCase();

  return (
    <div className="account-creation-options">
      <label htmlFor="name">Name</label>
      <div className={`dot ${classe}`} />
      <input
        type="text"
        name="name"
        placeholder="Account's name"
        value={props.options.name}
        onChange={e => props.changeName(e.target.value)}
      />
    </div>
  );
}

AccountCreationOptions.defaultProps = {
  currency: {
    units: [{name: ''}],
  },
};

AccountCreationOptions.propTypes = {
  currency: PropTypes.shape({
    name: PropTypes.string,
  }),
  options: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  changeName: PropTypes.func.isRequired,
};

export default AccountCreationOptions;
