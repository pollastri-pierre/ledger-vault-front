import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';

class BlurDialog extends Component {
  render() {
    let bodyStyle = {};

    if (this.props.nopadding) {
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
        bodyStyle={bodyStyle}
        contentStyle={{
					position: 'relative',
          display: 'table',
          width: 'initial',
        }}
        paperProps={{
          rounded: false,
          style: {
            boxShadow: '0px 20px 20px 0 rgba(0, 0, 0, 0.04)',
          },
        }}
        {...this.props}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

BlurDialog.propTypes = {
  children: PropTypes.node,
};

BlurDialog.defaultProps = {
  children: '',
};

export default BlurDialog;

