//@flow
import React, { Component } from "react";
import QRCode from "../../components/QRCode";

type Props = {
  hash: string
};

class ReceiveFundsCard extends Component<Props> {
  render() {
    const { hash } = this.props;
    return (
      <div className="bloc funds">
        <h3>Receive Funds</h3>
        <div className="bloc-content">
          <QRCode hash={hash} size={100} />
          <div className="right">
            <h4>current address</h4>
            <p className="hash">{hash}</p>
            <p className="info">
              A new address is generated when a first payment is received on the
              current address. Previous addresses remain valid and do not
              expire. remain valid and do not expire.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ReceiveFundsCard;
