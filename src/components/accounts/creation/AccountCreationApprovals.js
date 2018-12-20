//@flow
import React from "react";
import InfoModal from "../../InfoModal";
import { translate, Interpolate } from "react-i18next";
import DialogButton from "../../buttons/DialogButton";
import { connect } from "react-redux";
import { addMessage } from "redux/modules/alerts";
import InputTextWithUnity from "../../InputTextWithUnity";
import type { Member, Translate } from "data/types";
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
  t: Translate,
  classes: Object
}) {
  const {
    onAddMessage,
    switchInternalModal,
    approvals,
    setApprovals,
    t,
    members,
    classes
  } = props;

  const submit = () => {
    if (parseInt(approvals, 10) <= members.length) {
      switchInternalModal("main");
    } else {
      onAddMessage("Error", t("newAccount:errors.approvals_exceed"), "error");
    }
  };

  return (
    <div className={classes.base}>
      <header>
        <h2>{t("newAccount:security.approvals")}</h2>
      </header>
      <div className="content">
        <InputTextWithUnity
          label={t("newAccount:security.approvals_amount")}
          hasError={approvals > members.length}
          field={
            <input
              type="text"
              id="approval-field"
              autoFocus
              value={approvals}
              onChange={e => setApprovals(e.target.value)}
            />
          }
        >
          <span className="count">
            <Interpolate
              count={members.length}
              i18nKey="newAccount:security.approvals_from"
            />
          </span>
        </InputTextWithUnity>
        <InfoModal className={classes.info}>
          {t("newAccount:security.approvals_desc")}
        </InfoModal>
      </div>

      <div className="footer">
        <DialogButton right highlight onTouchTap={submit}>
          {t("common:done")}
        </DialogButton>
      </div>
    </div>
  );
}

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(translate()(AccountCreationApprovals)));
