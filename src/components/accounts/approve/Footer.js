import React from 'react';
import PropTypes from 'prop-types';
import { DialogButton } from '../../';

function Footer(props) {
  const { approved, close, approve, aborting } = props;

  if (approved) {
    return (
      <div className="footer">
        <DialogButton highlight className="cancel" onTouchTap={close}>Close</DialogButton>
      </div>
    );
  }

  return (
    <div className="footer">
      <DialogButton highlight className="cancel" onTouchTap={close}>Close</DialogButton>
      <div style={{ float: "right" }}>
        <DialogButton highlight className="abort margin" onTouchTap={aborting}>Abort</DialogButton>
        <DialogButton highlight onTouchTap={approve}>Approve</DialogButton>
      </div>
    </div>
  );
}

Footer.propTypes = {
  approved: PropTypes.bool,
  close: PropTypes.func,
  approve: PropTypes.func,
  abort: PropTypes.func,
};

export default Footer;
