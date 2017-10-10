import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';

function BlurDialog(props) {
  return (
    <Dialog
      overlayStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        boxShadow: '0px 20px 20px 0 rgba(0, 0, 0, 0.04)',
      }}
      bodyStyle={{
        color: 'black',
        padding: props.nopadding ? '0' : '40px 40px 0',
      }}
      contentStyle={{
        width: 'fit-content',
      }}
      paperProps={{
        rounded: false,
        style: {
          boxShadow: '0px 20px 20px 0 rgba(0, 0, 0, 0.04)',
        },
      }}
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

