// @flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { translate, Interpolate } from "react-i18next";
import { connect } from "react-redux";
import { addMessage } from "redux/modules/alerts";
import type { Member, Translate } from "data/types";
import modals from "shared/modals";
import InputTextWithUnity from "../../InputTextWithUnity";
import DialogButton from "../../buttons/DialogButton";
import InfoModal from "../../InfoModal";

const mapDispatchToProps = (dispatch: *) => ({
  onAddMessage: (title, content, type) =>
    dispatch(addMessage(title, content, type))
});

const styles = {
  base: {
    ...modals.base,
    width: 450
  },
  info: {
    margin: "20px 0px 40px 0px"
  }
};

type Props = {
  t: Translate,
  classes: { [_: $Keys<typeof styles>]: string },
  onAddMessage: (t: string, m: string, ty: string) => void,

  approvals: number,
  setApprovals: number => void,
  members: Member[],
  switchInternalModal: string => void
};

function AccountCreationApprovals(props: Props) {
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
