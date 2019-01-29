// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import { translate, Interpolate, Trans } from "react-i18next";
import { connect } from "react-redux";
import { addMessage } from "redux/modules/alerts";
import type { Translate } from "data/types";
import modals from "shared/modals";
import InputField from "components/InputField";
import Text from "components/Text";
import colors from "shared/colors";
import DialogButton from "components/buttons/DialogButton";
import InfoModal from "components/InfoModal";

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
  },
  inputRenderRightText: {
    whiteSpace: "nowrap",
    color: colors.lead
  }
};

type Props = {
  t: Translate,
  classes: { [_: $Keys<typeof styles>]: string },
  onAddMessage: (t: string, m: string, ty: string) => void,
  goBack: Function,
  quorum: number,
  approvers: string[],
  setQuorum: string => void
};

class SetApprovals extends Component<Props> {
  submit = () => {
    const { goBack, onAddMessage, approvers, quorum, t } = this.props;
    if (parseInt(quorum, 10) <= approvers.length) {
      goBack();
    } else {
      onAddMessage("Error", t("newAccount:errors.approvals_exceed"), "error");
    }
  };

  render() {
    const { setQuorum, quorum, approvers, classes } = this.props;
    return (
      <div className={classes.base}>
        <header>
          <Text header>
            <Trans i18nKey="newAccount:security.approvals" />
          </Text>
        </header>
        <div className="content">
          <InputField
            renderLeft={
              <Text small>
                <Trans i18nKey="newAccount:security.approvals_amount" />
              </Text>
            }
            value={quorum.toString()}
            autoFocus
            textAlign="right"
            onChange={setQuorum}
            placeholder="0"
            fullWidth
            error={quorum > approvers.length}
            renderRight={
              <Text small className={classes.inputRenderRightText}>
                <Interpolate
                  count={approvers.length}
                  i18nKey="newAccount:security.approvals_from"
                />
              </Text>
            }
          />
          <InfoModal className={classes.info}>
            <Trans i18nKey="newAccount:security.approvals_desc" />
          </InfoModal>
        </div>

        <div className="footer">
          <DialogButton right highlight onTouchTap={this.submit}>
            <Trans i18nKey="common:done" />
          </DialogButton>
        </div>
      </div>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(translate()(SetApprovals)));
