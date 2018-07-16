//@flow
import React, { Component } from "react";
import QRCodeCameraPickerCanvas from "./QRCodeCameraPickerCanvas";

const styles = {
  content: {
    width: 320,
    padding: "0 30px",
    fontSize: "11px",
    color: "#767676"
  },
  title: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#767676",
    fontFamily: "Open Sans"
  }
};

export default class QRCodeCameraPickerContent extends Component<{
  onPick: string => void
}> {
  render() {
    const { onPick } = this.props;
    return (
      <div style={styles.content}>
        <h3 style={styles.title}>SCAN QRCODE</h3>
        <QRCodeCameraPickerCanvas onPick={onPick} />
        <p>Place a QR code inside the center area to scan it.</p>
      </div>
    );
  }
}
