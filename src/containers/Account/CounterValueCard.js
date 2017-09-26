import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import PropTypes from 'prop-types';
import _ from 'lodash';

function CounterValueCard(props) {
  const { data, loading } = props;

  if (loading || _.isNull(data)) {
    return ( 
      <div className="bloc countervalue">
        <CircularProgress
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: '-20px',
            marginTop: '-20px',
          }}
        />
      </div>
    );
  }

  return (
    <div className="bloc countervalue">
      <div className="bloc-content">
        <h3>Countervalue</h3>
        <p className="amount ctv">{ data.amount }</p>
        <span className="date">ETH 1 ≈ { data.countervalue }</span>
      </div>
    </div>
  );
}

CounterValueCard.propTypes = {
  data: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool,
};

export default CounterValueCard;
