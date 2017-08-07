import React from 'react';
import PropTypes from 'prop-types';

import './DialogButton.css';

function DialogButton(props) {
  return (
    <button
      {...props}
      className={`vlt-dialog-btn ${props.highlight ? 'highlight' : ''} ${props.className}`}
      style={{
        float: props.right ? 'right' : 'left',
        ...props.style,
      }}
    >
      {props.children}
    </button>
  );
}

DialogButton.propTypes = {
  className: PropTypes.string,
  style: PropTypes.shape({}),
  children: PropTypes.node,
  highlight: PropTypes.bool,
  right: PropTypes.bool,
};

DialogButton.defaultProps = {
  className: '',
  style: {},
  children: '',
  highlight: false,
  right: false,
};

export default DialogButton;
