// @flow
import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import { NetworkError } from "network";
import type { RestlayEnvironment } from "restlay/connectData";
import PendingRequestsQuery from "api/queries/PendingRequestsQuery";
import { approveFlow } from "device/interactions/approveFlow";
import AbortRequestButton from "components/AbortRequestButton";
import ApproveRequestButton from "components/ApproveRequestButton";

import type { GateError } from "data/types";

type Props = {
  requestID: string,
  restlay: RestlayEnvironment,
  onSuccess: () => void,
  onError: ?(Error | GateError | typeof NetworkError) => void,
};

class PendingRequestFooter extends PureComponent<Props> {
  onClose = async () => {
    const { restlay, onSuccess } = this.props;
    await restlay.fetchQuery(new PendingRequestsQuery());
    onSuccess();
  };

  render() {
    const { requestID, onError } = this.props;
    const data = {};
    return (
      <Fragment>
        <AbortRequestButton
          requestID={requestID}
          onSuccess={this.onClose}
          onError={onError}
        />
        <ApproveRequestButton
          interactions={approveFlow}
          onSuccess={this.onClose}
          onError={onError}
          additionalFields={{
            data,
            type: "APPROVE_REQUEST",
            request_id: requestID,
          }}
          disabled={false}
          buttonLabel={<Trans i18nKey="common:approve" />}
        />
      </Fragment>
    );
  }
}

export default connectData(PendingRequestFooter);
