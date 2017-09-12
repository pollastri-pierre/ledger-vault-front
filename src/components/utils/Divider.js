import React from 'react';
import PropTypes from 'prop-types';

import './Divider.css';

function Divider(props) {
  return (
    <div
      {...props}
      className={`divider ${props.className}`}
    />
  );
}

Divider.propTypes = {
  className: PropTypes.node,
};

Divider.defaultProps = {
  className: '',
};

export default Divider;
