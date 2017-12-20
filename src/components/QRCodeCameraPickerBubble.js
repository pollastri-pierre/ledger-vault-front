//@flow
import React, { Component } from "react";
import Camera from "./icons/full/Camera";
import PopBubble from "./utils/PopBubble";
import QRCodeCameraPickerContent from "./QRCodeCameraPickerContent";

const styles = {
  icon: {
    cursor: "pointer"
  }
};

export default class QRCodeCameraPickerBubble extends Component<
  {
    onPick: string => void
  },
  {
    isOpen: boolean
  }
> {
  state = {
    isOpen: false
  };
  ref: ?HTMLElement;
  open = () => {
    this.setState({ isOpen: true });
  };
  close = () => {
    this.setState({ isOpen: false });
  };
  onRef = (ref: ?HTMLElement) => {
    this.ref = ref;
  };
  onPick = (result: string) => {
    this.close();
    this.props.onPick(result);
  };
  render() {
    const { isOpen } = this.state;
    return (
      <span ref={this.onRef}>
        <Camera
          style={styles.icon}
          onClick={this.open}
          width={13}
          height={11}
          color="#cccccc"
        />
        <PopBubble
          anchorEl={this.ref}
          open={isOpen}
          onClose={this.close}
        >
          {isOpen ? <QRCodeCameraPickerContent onPick={this.onPick} /> : null}
        </PopBubble>
      </span>
    );
  }
}
