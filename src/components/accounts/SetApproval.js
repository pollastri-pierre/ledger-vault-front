// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import { translate, Interpolate, Trans } from "react-i18next";
import { connect } from "react-redux";
import { addError } from "redux/modules/alerts";
import modals from "shared/modals";
import InputField from "components/InputField";
import Text from "components/base/Text";
import colors from "shared/colors";
import DialogButton from "components/buttons/DialogButton";
import { ApprovalsExceedQuorum } from "utils/errors";
import InfoBox from "components/base/InfoBox";

const mapDispatchToProps = (dispatch: *) => ({
  onAddError: error => dispatch(addError(error))
});

const styles = {
  base: {
    ...modals.base,
    width: 500,
    paddingBottom: 80
  },
  descTop: {
    marginBottom: 20
  },
  infoBox: {
    marginTop: 20
  },
  inputRenderRightText: {
    whiteSpace: "nowrap",
    color: colors.lead
  }
};

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  onAddError: Error => void,
  goBack: Function,
  quorum: number,
  approvers: string[],
  setQuorum: string => void
};

class SetApprovals extends Component<Props> {
  submit = () => {
    const { goBack, onAddError, approvers, quorum } = this.props;
    if (parseInt(quorum, 10) <= approvers.length) {
      goBack();
    } else {
      onAddError(new ApprovalsExceedQuorum());
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
          <Text className={classes.descTop}>
            <Trans i18nKey="newAccount:security.approvals_desc" />
          </Text>
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
          {quorum < 2 &&
            quorum !== 0 && (
              <InfoBox type="warning" withIcon className={classes.infoBox}>
                <Text>
                  <Trans
                    i18nKey="newAccount:security.approvalsMinimum"
                    components={<b>0</b>}
                  />
                </Text>
              </InfoBox>
            )}
          {quorum > approvers.length && (
            <InfoBox type="warning" withIcon className={classes.infoBox}>
              <Text>
                <Trans
                  i18nKey="newAccount:security.approvalsMaximum"
                  values={{ membersCount: approvers.length }}
                  components={<b>0</b>}
                />
              </Text>
            </InfoBox>
          )}
        </div>

        <div className="footer">
          <DialogButton
            right
            highlight
            onTouchTap={this.submit}
            disabled={quorum < 2}
          >
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
