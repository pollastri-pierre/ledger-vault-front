// @flow

import React, { Component } from "react";
import connectData from "restlay/connectData";
import { Trans } from "react-i18next";

import type { RestlayEnvironment } from "restlay/connectData";
import EditGroupDescriptionMutation from "api/mutations/EditGroupDescriptionMutation";
import Button from "components/base/Button";

type Props = {
  payload: *,
  restlay: RestlayEnvironment,
  onClose: Function,
};
class UpdateDescriptionButton extends Component<Props> {
  onSubmit = async () => {
    const { restlay, payload, onClose } = this.props;

    await restlay.commitMutation(
      new EditGroupDescriptionMutation({
        groupId: payload.id,
        description: payload.description,
      }),
    );
    onClose();
  };

  render() {
    return (
      <Button onClick={this.onSubmit} type="filled">
        <Trans i18nKey="group:create.submit_edit" />
      </Button>
    );
  }
}

export default connectData(UpdateDescriptionButton);
