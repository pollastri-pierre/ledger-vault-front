import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';

function BlurDialog(props) {
  let bodyStyle = {};

  if (props.nopadding) {
    bodyStyle = {
      padding: '0px',
      color: 'black',
    };
  } else {
    bodyStyle = {
      color: 'black',
      padding: '40px',
    };
  }

  return (
    <Dialog
      overlayStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        boxShadow: '0px 20px 20px 0 rgba(0, 0, 0, 0.04)',
      }}
      bodyStyle={{
        color: 'black',
        padding: props.nopadding ? '0' : '40px',

      }}
      contentStyle={{
        width: 'fit-content',
        // transform: 'translate(0, 15%)',
      }}
      paperProps={{
        rounded: false,
        style: {
          boxShadow: '0px 20px 20px 0 rgba(0, 0, 0, 0.04)',
        },
      }}
      autoDetectWindowHeight={false}
      {...props}
    >
      {props.children}
    </Dialog>
  );
}

BlurDialog.propTypes = {
  children: PropTypes.node,
  nopadding: PropTypes.bool,
};

BlurDialog.defaultProps = {
  children: '',
  nopadding: false,
};

export default BlurDialog;

