// @flow
import React, { PureComponent } from "react";
import Qrious from "qrious";

type Props = {
  hash: string,
  size: number,
  pixelRatio: number,
};

class QRCode extends PureComponent<Props> {
  static defaultProps = {
    size: 100,
    pixelRatio: (typeof window !== "undefined" && window.devicePixelRatio) || 1,
  };

  canvas: ?HTMLCanvasElement;

  qr: ?Qrious;

  componentDidMount() {
    this.drawQR(this.props.hash);
  }

  componentDidUpdate() {
    this.drawQR(this.props.hash);
  }

  drawQR(hash: string) {
    const { canvas } = this;
    const { size, pixelRatio } = this.props;
    if (!canvas) return;
    this.qr = new Qrious({
      foreground: "black",
      element: canvas,
      level: "L",
      size: size * pixelRatio,
      value: hash,
    });
  }

  onCanvasRef = (c: ?HTMLCanvasElement) => {
    this.canvas = c;
  };

  render() {
    const { size } = this.props;
    const width = size;
    const height = size;
    return <canvas ref={this.onCanvasRef} style={{ width, height }} />;
  }
}

export default QRCode;
