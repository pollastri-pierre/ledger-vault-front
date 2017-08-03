import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';

// Redux actions for toggling background blurring
import { blurBG, unblurBG } from './actions';

const mapDispatchToProps = dispatch => ({
  onOpen: () => {
    dispatch(blurBG());
  },
  onClose: () => {
    dispatch(unblurBG());
  },
});

const mapStateToProps = () => ({});

class BlurDialog extends Component {
  // Dispatch open state for background blurring
  componentDidUpdate() {
    if (this.props.open) {
      this.props.onOpen();
    } else {
      this.props.onClose();
    }
  }

  render() {
    return (
      <Dialog
        overlayStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
        bodyStyle={{
          color: 'black',
          padding: '40px',
        }}
        contentStyle={{
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
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  children: PropTypes.node,
};

BlurDialog.defaultProps = {
  open: false,
  children: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(BlurDialog);
