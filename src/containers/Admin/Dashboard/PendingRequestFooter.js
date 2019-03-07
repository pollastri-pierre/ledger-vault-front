// @flow
import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import RequestApproveMutation from "api/mutations/RequestApproveMutation";
import PendingRequestsQuery from "api/queries/PendingRequestsQuery";
import DialogButton from "components/buttons/DialogButton";
import AbortRequestButton from "components/AbortRequestButton";

import type { GateError } from "data/types";

type Props = {
  requestID: string,
  restlay: RestlayEnvironment,
  onSuccess: () => void,
  onError: (Error | GateError) => void
};

class AdminTasksFooter extends PureComponent<Props> {
  approve = async () => {
    const { onSuccess, onError, restlay, requestID } = this.props;
    try {
      // TODO: add device interation flow part
      await restlay.commitMutation(
        new RequestApproveMutation({
          requestID
        })
      );
      await restlay.fetchQuery(new PendingRequestsQuery());
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  onClose = async () => {
    const { restlay, onSuccess } = this.props;
    await restlay.fetchQuery(new PendingRequestsQuery());
    onSuccess();
  };

  render() {
    const { requestID, onError } = this.props;
    return (
      <Fragment>
        <AbortRequestButton
          requestID={requestID}
          onSuccess={this.onClose}
          onError={onError}
        />
        <DialogButton onTouchTap={this.approve}>
          <Trans i18nKey="common:approve" />
        </DialogButton>
      </Fragment>
    );
  }
}

export default connectData(AdminTasksFooter);
