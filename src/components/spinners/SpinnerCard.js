import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const SpinnerCard = () => {
  return (
    <CircularProgress
      size={30}
      style={{
        position: 'absolute',
        top: '52%',
        left: '50%',
        marginLeft: '-15px'
      }}
    />
  );
};

export default SpinnerCard;
