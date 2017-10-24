import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SpinnerCard } from '../../components';

function BalanceCard(props) {
  const { data, loading } = props;

  return (
    <div className="bloc balance">
      <h3>Balance</h3>
      {loading || _.isNull(data) ? (
        <SpinnerCard />
      ) : (
        <div className="bloc-content">
          <p className="amount">{data.value}</p>
          <span className="date">{data.date}</span>
        </div>
      )}
    </div>
  );
}

BalanceCard.defaultProps = {
  data: null
};

BalanceCard.propTypes = {
  data: PropTypes.shape({}),
  loading: PropTypes.bool.isRequired
};

export default BalanceCard;
