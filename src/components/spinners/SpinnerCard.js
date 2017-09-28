import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const SpinnerCard = () => {
  return (
    <CircularProgress
      size={25}
      style={{
        position: 'absolute',
        top: '52%',
        left: '50%',
        marginLeft: '-12.5px'
      }}
    />
  );
};

export default SpinnerCard;
