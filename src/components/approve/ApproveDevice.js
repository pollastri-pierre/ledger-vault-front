import React from "react";
import PropTypes from "prop-types";
import { DialogButton } from "../";
import Plug from "../icons/thin/Plug";

function ApproveDevice(props) {
  const { cancel, entity } = props;
  return (
    <div id="account-approve-device" className="small-modal">
      <header>
        <Plug className="plug-icon" fill="#e2e2e2" />
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

ApproveDevice.propTypes = {
  cancel: PropTypes.func.isRequired,
  entity: PropTypes.string.isRequired
};

export default ApproveDevice;
