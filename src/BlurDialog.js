import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

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
    const defaultActions = (
      <FlatButton
        label="Ok"
        primary
        onClick={this.props.onRequestClose}
      />
    );

    return (
      <Dialog
        actions={defaultActions}
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
  onRequestClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  children: PropTypes.node,
};

BlurDialog.defaultProps = {
  open: false,
  children: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(BlurDialog);
