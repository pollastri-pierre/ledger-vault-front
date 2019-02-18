// @flow
import React, { Component } from "react";
import { translate, Interpolate, Trans } from "react-i18next";
import { connect } from "react-redux";

import { addError } from "redux/modules/alerts";
import colors from "shared/colors";
import { ApprovalsExceedQuorum } from "utils/errors";

import InfoBox from "components/base/InfoBox";
import DialogButton from "components/buttons/DialogButton";
import InputField from "components/InputField";
import Text from "components/base/Text";
import Box from "components/base/Box";
import {
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalHeader
} from "components/base/Modal";

const mapDispatchToProps = (dispatch: *) => ({
  onAddError: error => dispatch(addError(error))
});

type Props = {
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
    const { setQuorum, quorum, approvers } = this.props;

    const inputLeft = (
      <Text small>
        <Trans i18nKey="newAccount:security.approvals_amount" />
      </Text>
    );

    const inputRight = (
      <Text small noWrap color={colors.lead}>
        <Interpolate
          count={approvers.length}
          i18nKey="newAccount:security.approvals_from"
        />
      </Text>
    );

    return (
      <ModalBody>
        <ModalHeader>
          <ModalTitle mb={0}>
            <Trans i18nKey="newAccount:security.approvals" />
          </ModalTitle>
        </ModalHeader>

        <Box mb={20}>
          <Text>
            <Trans i18nKey="newAccount:security.approvals_desc" />
          </Text>
        </Box>

        <InputField
          renderLeft={inputLeft}
          value={quorum.toString()}
          autoFocus
          textAlign="right"
          onChange={setQuorum}
          placeholder="0"
          fullWidth
          error={quorum > approvers.length}
          renderRight={inputRight}
        />

        {quorum < 2 &&
          quorum !== 0 && (
            <Box mt={20}>
              <InfoBox type="warning" withIcon>
                <Text>
                  <Trans
                    i18nKey="newAccount:security.approvalsMinimum"
                    components={<b>0</b>}
                  />
                </Text>
              </InfoBox>
            </Box>
          )}

        {quorum > approvers.length && (
          <Box mt={20}>
            <InfoBox type="warning" withIcon>
              <Text>
                <Trans
                  i18nKey="newAccount:security.approvalsMaximum"
                  values={{ membersCount: approvers.length }}
                  components={<b>0</b>}
                />
              </Text>
            </InfoBox>
          </Box>
        )}

        <ModalFooter>
          <DialogButton
            right
            highlight
            onTouchTap={this.submit}
            disabled={quorum < 2}
          >
            <Trans i18nKey="common:done" />
          </DialogButton>
        </ModalFooter>
      </ModalBody>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(translate()(SetApprovals));
