import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Qrious from 'qrious';

class ReceiveFundsCard extends Component {
  componentDidMount() {
    const { hash } = this.props;
    const elm = this.canvas;

    this.qr = new Qrious({
      foreground: 'black',
      element: elm,
      level: 'H',
      size: 100,
      value: hash,
    });
  }

  componentWillUpdate(nextProps) {
    this.qr.set({
      value: nextProps.hash,
    });
    
  }

  render() {
    const { hash } = this.props;
    return (
      <div className="bloc funds">
        <h3>Receive Funds</h3>
        <canvas ref={(c) => { this.canvas = c; }} />
        <div className="right">
          <h4>current address</h4>
          <p className="hash">{ hash }</p>
          <p className="info">
            A new address is generated when a first payment is received on the current address.
            Previous addresses remain valid and do not expire.
            remain valid and do not expire.
          </p>

        </div>
      </div>
    );
  }
}

ReceiveFundsCard.defaultProps = {
  hash: '',
};

ReceiveFundsCard.propTypes = {
  hash: PropTypes.string,
};

export default ReceiveFundsCard;
