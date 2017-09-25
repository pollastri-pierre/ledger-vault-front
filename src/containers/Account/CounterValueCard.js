import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

function CounterValueCard(props) {
  const { data } = props;

  return (
    <div className="bloc countervalue">
      <h3>Countervalue</h3>
      <p className="amount ctv">{ data.amount }</p>
      <span className="date">ETH 1 ≈ { data.countervalue }</span>
    </div>
  );
}


export default CounterValueCard;
