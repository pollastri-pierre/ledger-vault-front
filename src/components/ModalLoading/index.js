// @flow
import React, { PureComponent } from "react";
import SpinnerCard from "../spinners/SpinnerCard";

type Props = {
  width?: number,
  height?: number,
};

class ModalLoading extends PureComponent<Props> {
  static defaultProps = {
    width: 500,
    height: 615,
  };

  render() {
    const { width, height } = this.props;
    return (
      <div style={{ width, height, background: "white", borderRadius: 4 }}>
        <SpinnerCard />
      </div>
    );
  }
}

export default ModalLoading;
