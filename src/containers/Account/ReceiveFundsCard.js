import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Qrious from 'qrious';
import { SpinnerCard } from '../../components';

class ReceiveFundsCard extends Component {
  componentDidUpdate() {
    if (this.props.data && this.props.data.hash) {
      const { hash } = this.props.data;
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

    return (
      <div className="bloc funds">
        <h3>Receive Funds</h3>
        {(loading || _.isNull(data)) ?
          <SpinnerCard />
          :
          <div className="bloc-content">
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
        }
      </div>
    );
  }
}

ReceiveFundsCard.defaultProps = {
  data: null,
};

ReceiveFundsCard.propTypes = {
  data: PropTypes.shape({
    hash: PropTypes.string,
  }),
  loading: PropTypes.bool.isRequired,
};

export default ReceiveFundsCard;
