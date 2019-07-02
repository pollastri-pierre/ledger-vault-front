// @flow
import React, { PureComponent } from "react";

const QRCode = require("qrcode");

type Props = {
  hash: string,
  size: number,
  pixelRatio: number,
};

class QRCodeComponent extends PureComponent<Props> {
  static defaultProps = {
    size: 100,
    pixelRatio: (typeof window !== "undefined" && window.devicePixelRatio) || 1,
  };

  componentDidMount() {
    this.drawQR(this.props.hash);
  }

  componentDidUpdate() {
    this.drawQR(this.props.hash);
  }

  drawQR(hash: string) {
    const { pixelRatio, size } = this.props;
    QRCode.toCanvas(
      hash,
      { errorCorrectionLevel: "L", width: pixelRatio * size },
      function(err, canvas) {
        if (err) throw err;
        const container = document.getElementById("qrcode-address");
        if (container) {
          container.appendChild(canvas);
        }
      },
    );
  }

  render() {
    const { size } = this.props;
    const width = size;
    const height = size;
    return <div id="qrcode-address" style={{ width, height }} />;
  }
}

export default QRCodeComponent;
