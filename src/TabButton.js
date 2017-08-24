import React from 'react';
import PropTypes from 'prop-types';

import './TabButton.css';

function TabButton(props) {
  const { highlight, right, ...other } = props;

  return (
    <button
      {...other}
      className={`vlt-tab-btn ${highlight ? 'highlight' : ''} ${props.className}`}
      style={{
        float: right ? 'right' : 'left',
        ...props.style,
      }}
    >
      {props.children}
    </button>
  );
}

TabButton.propTypes = {
  className: PropTypes.string,
  style: PropTypes.shape({}),
  children: PropTypes.node,
  highlight: PropTypes.bool,
  right: PropTypes.bool,
};

TabButton.defaultProps = {
  className: '',
  style: {},
  children: '',
  highlight: false,
  right: false,
};

export default TabButton;
