//@flow
import React from "react";
import DialogButton from "../buttons/DialogButton";

function Footer(props: {
  approved: boolean,
  close: Function,
  approve: Function,
  aborting: Function,
  percentage?: *
}) {
  const { approved, close, approve, aborting, percentage } = props;

  if (approved) {
    return (
      <div className="footer-approve">
        <DialogButton highlight className="cancel" onTouchTap={close}>
          Close
        </DialogButton>
      </div>
    );
  }

  return (
    <div className="footer-approve">
      {percentage}
      <DialogButton highlight className="cancel" onTouchTap={close}>
        Close
      </DialogButton>
      <div style={{ float: "right" }}>
        <DialogButton highlight className="abort margin" onTouchTap={aborting}>
          Abort
        </DialogButton>
        <DialogButton highlight onTouchTap={approve}>
          Approve
        </DialogButton>
      </div>
    </div>
  );
}

export default Footer;
