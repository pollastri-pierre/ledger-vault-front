// @flow
import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import { NetworkError } from "network";
import { withMe } from "components/UserContextProvider";
import type { RestlayEnvironment } from "restlay/connectData";
import RequestsQuery from "api/queries/RequestsQuery";
import { approveFlow } from "device/interactions/approveFlow";
import AbortRequestButton from "components/AbortRequestButton";
import ApproveRequestButton from "components/ApproveRequestButton";
import Box from "components/base/Box";
import { hasUserApprovedRequest } from "utils/request";

import type { GateError, User, Request } from "data/types";

type Props = {
  restlay: RestlayEnvironment,
  onSuccess: () => void,
  onError: ?(Error | GateError | typeof NetworkError) => void,
  request: Request,
  me: User,
};

class RequestFooter extends PureComponent<Props> {
  onClose = async () => {
    const { restlay, onSuccess } = this.props;
    await restlay.fetchQuery(new RequestsQuery({ status: "PENDING_APPROVAL" }));
    onSuccess();
  };

  render() {
    const { onError, request, me } = this.props;
    const data = {};
    const hasUserApproved =
      request.approvals && hasUserApprovedRequest(request, me);
    return (
      <Fragment>
        {(request.status === "PENDING_APPROVAL" ||
          request.status === "PENDING_REVOCATION") &&
          !hasUserApproved && (
            <Box horizontal flow={10}>
              <AbortRequestButton
                requestID={request.id}
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
                  request_id: request.id,
                }}
                disabled={false}
                buttonLabel={<Trans i18nKey="common:approve" />}
              />
            </Box>
          )}
      </Fragment>
    );
  }
}

export default connectData(withMe(RequestFooter));
