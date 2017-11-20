//@flow
import React from "react";
import DialogButton from "../buttons/DialogButton";
import "./Footer.css";

function Footer(props: {
  approved: boolean,
  close: Function,
  approve: Function,
  aborting: Function
}) {
  const { approved, close, approve, aborting } = props;

  if (approved) {
    return (
      <div className="footer">
        <DialogButton highlight className="cancel" onTouchTap={close}>
          Close
        </DialogButton>
      </div>
    );
  }

  return (
    <div className="footer">
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
