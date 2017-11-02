//@flow
import React, { PureComponent } from "react";
import SpinnerCard from "../spinners/SpinnerCard";
import "./index.css";

class ModalLoading extends PureComponent<*> {
  render() {
    return (
      <div className="modal-loading">
        <SpinnerCard />
      </div>
    );
  }
}

export default ModalLoading;
