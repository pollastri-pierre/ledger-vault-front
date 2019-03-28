// @flow
import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import { approveFlow } from "device/interactions/approveFlow";
import AbortRequestButton from "components/AbortRequestButton";
import ApproveRequestButton from "components/ApproveRequestButton";

import type { Entity } from "data/types";

type Props = {
  onSuccess: Function,
  onError: Function,
  entity: Entity,
};

class RequestActionButtons extends PureComponent<Props> {
  render() {
    const { entity, onSuccess, onError } = this.props;

    return (
      <Fragment>
        <AbortRequestButton
          requestID={entity.last_request && entity.last_request.id}
          onSuccess={onSuccess}
        />
        <ApproveRequestButton
          interactions={approveFlow}
          onSuccess={onSuccess}
          onError={onError}
          additionalFields={{
            request_id: entity.last_request && entity.last_request.id,
          }}
          disabled={false}
          buttonLabel={
            <Trans
              i18nKey={
                entity.last_request
                  ? `request:approve.${entity.last_request.type}`
                  : `common:approve`
              }
            />
          }
        />
      </Fragment>
    );
  }
}

export default RequestActionButtons;
