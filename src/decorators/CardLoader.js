import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import _ from 'lodash';

export default (BaseComponent, data, getData, loading) => {
  const CardLoader = (props) => {

    if (_.isNull(data) && !loading) {
      getData();
    }

    if (loading) {
      return (
        <div {...props} >
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
      <BaseComponent data={data} { ...props }>
      </BaseComponent>
    );
  };

  return CardLoader;
};
