//@flow
import React from "react";
import { DialogButton } from "../";
import { PlugIcon } from "../icons";
import "./index.css";

function ApproveDevice(props: { cancel: Function, entity: string }) {
  const { cancel, entity } = props;
  return (
    <div className="approve-device">
      <header>
        <PlugIcon fill="#e2e2e2" />

        <h3>Approve {entity}</h3>
      </header>

      <div className="content">
        <ul>
          <li>
            <span className="bullet">1.</span>
            Connect your Ledger Blue to your computer using one of its USB port.
          </li>
          <li>
            <span className="bullet">2.</span>
            Power on your device and unlock it by entering your 4 to 8 digit
            personal PIN code.
          </li>
          <li>
            <span className="bullet">3.</span>
            Open the Vault app on the dashboard. When displayed, approve the{" "}
            {entity} request on the device.
          </li>
        </ul>
      </div>
      <div className="footer">
        <DialogButton highlight className="cancel margin" onTouchTap={cancel}>
          Cancel
        </DialogButton>
        <div className="wait">awaiting device...</div>
      </div>
    </div>
  );
}

export default ApproveDevice;
