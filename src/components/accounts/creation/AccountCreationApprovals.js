//@flow
import React from "react";
import InfoModal from "../../InfoModal";
import DialogButton from "../../buttons/DialogButton";
import { connect } from "react-redux";
import { addMessage } from "redux/modules/alerts";
import InputTextWithUnity from "../../InputTextWithUnity";
import type { Member } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import modals from "shared/modals";

const mapDispatchToProps = (dispatch: *) => ({
  onAddMessage: (title, content, type) =>
    dispatch(addMessage(title, content, type))
});

const styles = {
  base: {
    ...modals.base,
    width: 440
  },
  info: {
    margin: "20px 0px 40px 0px"
  }
};
function AccountCreationApprovals(props: {
  members: Member[],
  approvals: number,
  switchInternalModal: Function,
  onAddMessage: (t: string, m: string, ty: string) => void,
  setApprovals: (v: string) => void,
  classes: Object
}) {
  const {
    onAddMessage,
    switchInternalModal,
    approvals,
    setApprovals,
    members,
    classes
  } = props;

  const submit = () => {
    if (parseInt(approvals, 10) <= members.length) {
      switchInternalModal("main");
    } else {
      onAddMessage(
        "Error",
        "Number of approvals cannot exceed number of members",
        "error"
      );
    }
  };

  return (
    <div className={classes.base}>
      <header>
        <h2>Approvals</h2>
      </header>
      <div className="content">
        <InputTextWithUnity
          label="Amount"
          hasError={approvals > members.length}
          field={
            <input
              type="text"
              id="approval-field"
              value={approvals}
              onChange={e => setApprovals(e.target.value)}
            />
          }
        >
          <span className="count">approvals from {members.length} members</span>
        </InputTextWithUnity>
        <InfoModal className={classes.info}>
          Approvals define the number of required signatures from the group of
          members allowed to approve outgoing operations.
        </InfoModal>
      </div>

      <div className="footer">
        <DialogButton right highlight onTouchTap={submit}>
          Done
        </DialogButton>
      </div>
    </div>
  );
}

export default connect(undefined, mapDispatchToProps)(
  withStyles(styles)(AccountCreationApprovals)
);
