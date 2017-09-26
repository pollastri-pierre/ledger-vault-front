import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Qrious from 'qrious';
import CircularProgress from 'material-ui/CircularProgress';
import _ from 'lodash';

class ReceiveFundsCard extends Component {

  componentDidUpdate() {
    if (this.props.data && this.props.data.hash) {
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
  }

  render() {
    const { data, loading } = this.props;

    if (loading || _.isNull(data)) {
      return ( 
        <div className="bloc funds">
          <CircularProgress
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: '-20px',
              marginTop: '-20px',
            }}
          />
        </div>
      );
    }

    return (
      <div className="bloc funds">
        <div className="bloc-content">
          <h3>Receive Funds</h3>
          <canvas ref={(c) => { this.canvas = c; }} />
          <div className="right">
            <h4>current address</h4>
            <p className="hash">{ data.hash }</p>
            <p className="info">
              A new address is generated when a first payment is received on the current address.
              Previous addresses remain valid and do not expire.
              remain valid and do not expire.
            </p>
          </div>
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
