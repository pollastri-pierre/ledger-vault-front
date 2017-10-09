import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';

function CardLoading(props) {
  const { loading, getData, data, children } = props;

  if (_.isNull(data) && !loading) {
    getData();
  }

  if (loading) {
    return (
      <div {...props}>
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
    <div {...props}>
      { children }
    </div>
  );
}

CardLoading.defaultProps = {
  loading: false,
};

CardLoading.propTypes = {
  children: PropTypes.element.isRequired,
  loading: PropTypes.bool,
  data: PropTypes.shape({}).isRequired,
  getData: PropTypes.func.isRequired,
};
export default CardLoading;
