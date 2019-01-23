// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import { translate, Interpolate } from "react-i18next";
import { connect } from "react-redux";
import { addMessage } from "redux/modules/alerts";
import type { Translate } from "data/types";
import modals from "shared/modals";
import type {
  State as AccountCreationState,
  UpdateState as UpdateAccountCreationState,
  InternModalId
} from "redux/modules/account-creation";
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

  switchInternalModal: InternModalId => void,
  accountCreationState: AccountCreationState,
  updateAccountCreationState: UpdateAccountCreationState
};

class AccountCreationApprovals extends Component<Props> {
  submit = () => {
    const {
      switchInternalModal,
      onAddMessage,
      accountCreationState: { approvers, quorum },
      t
    } = this.props;
    if (parseInt(quorum, 10) <= approvers.length) {
      switchInternalModal("main");
    } else {
      onAddMessage("Error", t("newAccount:errors.approvals_exceed"), "error");
    }
  };

  setQuorum = (nb: string) => {
    const { updateAccountCreationState } = this.props;
    updateAccountCreationState(() => ({ quorum: parseInt(nb, 10) || 0 }));
  };

  render() {
    const {
      t,
      accountCreationState: { approvers, quorum },
      classes
    } = this.props;
    return (
      <div className={classes.base}>
        <header>
          <h2>{t("newAccount:security.approvals")}</h2>
        </header>
        <div className="content">
          <InputTextWithUnity
            label={t("newAccount:security.approvals_amount")}
            hasError={quorum > approvers.length}
            field={
              <input
                type="text"
                id="approval-field"
                autoFocus
                value={quorum}
                onChange={e => this.setQuorum(e.target.value)}
              />
            }
          >
            <span className="count">
              <Interpolate
                count={approvers.length}
                i18nKey="newAccount:security.approvals_from"
              />
            </span>
          </InputTextWithUnity>
          <InfoModal className={classes.info}>
            {t("newAccount:security.approvals_desc")}
          </InfoModal>
        </div>

        <div className="footer">
          <DialogButton right highlight onTouchTap={this.submit}>
            {t("common:done")}
          </DialogButton>
        </div>
      </div>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(translate()(AccountCreationApprovals)));
