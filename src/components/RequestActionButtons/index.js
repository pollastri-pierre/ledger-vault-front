// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { approveFlow } from "device/interactions/approveFlow";
import AbortRequestButton from "components/AbortRequestButton";
import { withMe } from "components/UserContextProvider";
import ApproveRequestButton from "components/ApproveRequestButton";
import { hasUserApprovedRequest } from "utils/request";
import colors from "shared/colors";
import { FaCheckCircle } from "react-icons/fa";

import type { Entity, User } from "data/types";

type Props = {
  onSuccess: Function,
  onError: Function,
  me: User,
  entity: Entity,
};

const checkedIcon = <FaCheckCircle color={colors.ocean} size={20} />;
class RequestActionButtons extends PureComponent<Props> {
  render() {
    const { entity, onSuccess, onError, me } = this.props;

    const hasUserApproved =
      entity.last_request &&
      entity.last_request.approvals &&
      hasUserApprovedRequest(entity.last_request, me);

    return (
      <Box
        pt={20}
        style={{
          background: "#f5f5f5",
        }}
      >
        <Box flow={10} width="100%" align="center" justify="center">
          {entity.last_request && (
            <Text small>
              A <b>{entity.last_request.type}</b> request is pending.
            </Text>
          )}
          {hasUserApproved ? (
            <Box horizontal align="center" flow={10} pb={20}>
              {checkedIcon}
              <Text bold>You already approved the request.</Text>
            </Box>
          ) : (
            <Box
              horizontal
              align="center"
              width="100%"
              justify="space-between"
              px={15}
            >
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
            </Box>
          )}
        </Box>
      </Box>
    );
  }
}

export default withMe(RequestActionButtons);
