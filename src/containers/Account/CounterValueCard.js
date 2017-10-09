import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { SpinnerCard } from '../../components';

function CounterValueCard(props) {
  const { data, loading } = props;

  return (
    <div className="bloc countervalue">
      <h3>Countervalue</h3>
      { (loading || _.isNull(data)) ?
        <SpinnerCard />
        :
        <div className="bloc-content">
          <p className="amount ctv">{ data.amount }</p>
          <span className="date">ETH 1 ≈ { data.countervalue }</span>
        </div>
      }
    </div>
  );
}
CounterValueCard.defaultProps = {
  data: null,
};

CounterValueCard.propTypes = {
  data: PropTypes.shape({}),
  loading: PropTypes.bool.isRequired,
};

export default CounterValueCard;
