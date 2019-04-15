// @flow

import React, { Component } from "react";
import { FaCheck } from "react-icons/fa";
import connectData from "restlay/connectData";
import { Trans } from "react-i18next";
import colors from "shared/colors";
import { ModalFooterButton } from "components/base/Modal";
import type { RestlayEnvironment } from "restlay/connectData";
import EditGroupDescriptionMutation from "api/mutations/EditGroupDescriptionMutation";

type State = {
  isLoading: boolean,
};
type Props = {
  payload: *,
  restlay: RestlayEnvironment,
  onClose: Function,
};
class UpdateDescriptionButton extends Component<Props, State> {
  state = {
    isLoading: false,
  };

  onSubmit = async () => {
    const { restlay, payload, onClose } = this.props;

    this.setState({ isLoading: true });
    try {
      await restlay.commitMutation(
        new EditGroupDescriptionMutation({
          groupId: payload.id,
          description: payload.description,
        }),
      );
      onClose();
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isLoading } = this.state;
    return (
      <ModalFooterButton
        data-test="update-description"
        onClick={this.onSubmit}
        isLoading={isLoading}
        color={colors.ocean}
      >
        <FaCheck style={{ marginRight: 10 }} />
        <Trans i18nKey="group:create.submit_edit" />
      </ModalFooterButton>
    );
  }
}

export default connectData(UpdateDescriptionButton);
