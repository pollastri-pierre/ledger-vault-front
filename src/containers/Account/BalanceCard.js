import React from 'react';
import _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import PropTypes from 'prop-types';

function BalanceCard(props) {
  const { data, loading } = props;

  if (loading || _.isNull(data)) {
    return ( 
      <div className="bloc balance">
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
    <div className="bloc balance">
      <div className="bloc-content">
        <h3>Balance</h3>
        <p className="amount">{ data.value }</p>
        <span className="date">{ data.date }</span>
      </div>
    </div>
  );
}

BalanceCard.propTypes = {
  data: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool,
};


export default BalanceCard;
