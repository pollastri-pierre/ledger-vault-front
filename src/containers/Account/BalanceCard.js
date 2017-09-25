import React from 'react';
import PropTypes from 'prop-types';

function BalanceCard(props) {
  const { data } = props;

  return (
    <div className="bloc balance">
      <h3>Balance</h3>
      <p className="amount">{ data.value }</p>
      <span className="date">{ data.date }</span>
    </div>
  );
}

BalanceCard.defaultProps = {
  data: {},
};

BalanceCard.propTypes = {
  data: PropTypes.shape({}),
};


export default BalanceCard;
