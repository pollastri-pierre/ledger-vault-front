import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'material-ui/Popover';

import './PopBubble.css';

function PopBubble(props) {
  return (
    <Popover
      className="pop-bubble"
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      style={{ marginTop: '5px' }}
      {...props}
    >
      {props.children}
    </Popover>
  );
}

PopBubble.propTypes = {
  children: PropTypes.node,
};

PopBubble.defaultProps = {
  children: '',
};

export default PopBubble;
