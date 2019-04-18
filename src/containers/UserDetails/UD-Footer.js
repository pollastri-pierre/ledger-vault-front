// @flow

import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";

import ApproveRequestButton from "components/ApproveRequestButton";
import RequestActionButtons from "components/RequestActionButtons";
import { createAndApprove } from "device/interactions/approveFlow";

import type { User } from "data/types";

type Props = {
  status: string,
  close: () => void,
  user: User,
};

class UserDetailsFooter extends PureComponent<Props> {
  onSuccess = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { status, user } = this.props;
    return (
      <Fragment>
        {(status === "PENDING_APPROVAL" || status === "PENDING_REVOCATION") && (
          <RequestActionButtons
            onSuccess={this.onSuccess}
            onError={null}
            entity={user}
          />
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

export default UserDetailsFooter;
