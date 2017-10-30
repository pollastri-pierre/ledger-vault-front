//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import Qrious from "qrious";

type Props = {
  hash: string
};

class ReceiveFundsCard extends Component<Props> {
  canvas: ?HTMLCanvasElement;
  qr: ?Qrious;

  componentDidMount() {
    this.drawQR(this.props.hash);
  }

  componentWillReceiveProps({ hash }: Props) {
    if (hash !== this.props.hash) {
      this.drawQR(hash);
    }
  }

  drawQR = (hash: string) => {
    const { canvas } = this;
    if (!canvas) return;
    this.qr = new Qrious({
      foreground: "black",
      element: canvas,
      level: "H",
      size: 100,
      value: hash
    });
  };

  onCanvasRef = (c: ?HTMLCanvasElement) => {
    this.canvas = c;
  };

  render() {
    const { hash } = this.props;

    return (
      <div className="bloc funds">
        <h3>Receive Funds</h3>
        <div className="bloc-content">
          {/* TODO make this canvas a standalone component */}
          <canvas ref={this.onCanvasRef} />
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
