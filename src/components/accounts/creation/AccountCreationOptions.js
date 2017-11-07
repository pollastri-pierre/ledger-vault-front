import React from "react";
import PropTypes from "prop-types";
import BadgeCurrency from "../../BadgeCurrency";

function AccountCreationOptions(props) {
  return (
    <div className="account-creation-options">
      <label htmlFor="name">Name</label>
      <BadgeCurrency currency={props.currency} />
      <input
        type="text"
        name="name"
        placeholder="Account's name"
        value={props.name}
        onChange={e => props.changeName(e.target.value)}
      />
    </div>
  );
}

AccountCreationOptions.defaultProps = {
  currency: {
    units: [{ name: "" }]
  }
};

AccountCreationOptions.propTypes = {
  currency: PropTypes.shape({
    name: PropTypes.string
  }),
  name: PropTypes.string.isRequired,
  changeName: PropTypes.func.isRequired
};

export default AccountCreationOptions;
