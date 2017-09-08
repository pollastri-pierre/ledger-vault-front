import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'material-ui/Popover';

import './PopBubble.css';

function PopBubble(props) {
  return (
    <Popover
      {...props}
      className="pop-bubble"
      anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
      targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
      style={{
        marginTop: '15px',
        borderRadius: 0,
        ...props.style,
      }}
    >
      {props.children}
    </Popover>
  );
}

PopBubble.propTypes = {
  children: PropTypes.node,
  style: PropTypes.shape({}),
};

PopBubble.defaultProps = {
  children: '',
  style: {},
};

export default PopBubble;

