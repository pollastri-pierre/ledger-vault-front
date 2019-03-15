// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { withMe } from "components/UserContextProvider";
import Box from "components/base/Box";
import ApproveRequestButton from "components/ApproveRequestButton";
import AbortRequestButton from "components/AbortRequestButton";
import { approveFlow, createAndApprove } from "device/interactions/approveFlow";
import { hasUserApprovedRequest } from "utils/request";

import type { Member } from "data/types";

type Props = {
  status: string,
  close: () => void,
  user: Member,
  me: Member,
};

class UserDetailsFooter extends PureComponent<Props> {
  onSuccess = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { status, user, me } = this.props;
    const hasUserApproved =
      user.last_request &&
      user.last_request.approvals &&
      hasUserApprovedRequest(user.last_request, me);

    return (
      <Box pb={10}>
        {(status === "PENDING_APPROVAL" || status === "PENDING_REVOCATION") &&
          !hasUserApproved && (
            <Box horizontal flow={10}>
              <AbortRequestButton
                requestID={user.last_request && user.last_request.id}
                onSuccess={this.onSuccess}
              />
              <ApproveRequestButton
                interactions={approveFlow}
                onSuccess={this.onSuccess}
                onError={null}
                disabled={false}
                additionalFields={{
                  data: {},
                  request_id: user.last_request && user.last_request.id,
                  type: "APPROVE_REQUEST",
                }}
                buttonLabel={<Trans i18nKey="common:approve" />}
              />
            </Box>
          )}
        {status === "ACTIVE" && (
          <ApproveRequestButton
            interactions={createAndApprove}
            onSuccess={this.onSuccess}
            onError={null}
            disabled={false}
            additionalFields={{
              data: { user_id: user.id },
              type: "REVOKE_USER",
            }}
            buttonLabel={<Trans i18nKey="common:revoke" />}
          />
        )}
      </Box>
    );
  }
}

export default withMe(UserDetailsFooter);
