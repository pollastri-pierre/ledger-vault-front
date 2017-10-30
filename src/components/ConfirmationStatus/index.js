//@flow
import React, { Component } from "react";
import ValidateBadge from "../icons/ValidateBadge";
import "./index.css";

class ConfirmationStatus extends Component<*> {
  props: {
    nbConfirmations: number
  };

  render() {
    const { nbConfirmations } = this.props;

    if (nbConfirmations > 0) {
      return (
        <span>
          <strong>Confirmed ({nbConfirmations})</strong>
          <ValidateBadge className="confirmed operation-status" />
        </span>
      );
    }

    return <span>Unconfirmed</span>;
  }
}

export default ConfirmationStatus;
