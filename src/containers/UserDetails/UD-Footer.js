// @flow
import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import { withMe } from "components/UserContextProvider";
import ApproveRequestButton from "components/ApproveRequestButton";
import AbortRequestButton from "components/AbortRequestButton";
import { approveFlow, createAndApprove } from "device/interactions/approveFlow";
import { hasUserApprovedRequest } from "utils/request";

import type { User } from "data/types";

type Props = {
  status: string,
  close: () => void,
  user: User,
  me: User,
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
      <Fragment>
        {(status === "PENDING_APPROVAL" || status === "PENDING_REVOCATION") &&
          !hasUserApproved && (
            <Fragment>
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
            </Fragment>
          )}
        {status === "ACTIVE" && (
          <Fragment>
            <div />
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
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default withMe(UserDetailsFooter);
