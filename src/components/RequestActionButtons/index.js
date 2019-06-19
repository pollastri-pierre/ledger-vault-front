// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";

import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import { approveFlow } from "device/interactions/hsmFlows";
import AbortRequestButton from "components/AbortRequestButton";
import { withMe } from "components/UserContextProvider";
import ApproveRequestButton from "components/ApproveRequestButton";
import {
  hasUserApprovedCurrentStep,
  hasUserApprovedRequest,
  isUserInCurrentStep,
} from "utils/request";
import colors from "shared/colors";

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

    const lastRequest = entity.last_request;
    if (!lastRequest) return null;

    const userInCurrentStep = isUserInCurrentStep(lastRequest, me);
    const userApprovedCurrentStep = hasUserApprovedCurrentStep(lastRequest, me);
    const userApprovedRequest = hasUserApprovedRequest(lastRequest, me);
    const isUserCreationRequest =
      lastRequest.type === "CREATE_OPERATOR" ||
      lastRequest.type === "CREATE_ADMIN";

    const isRequestBlocked = lastRequest.status === "BLOCKED";
    const isPendingRegistration = lastRequest.status === "PENDING_REGISTRATION";

    const inner = isRequestBlocked ? (
      <Box align="center" justify="center">
        <InfoBox type="error">
          <Text>The request has been blocked.</Text>
        </InfoBox>
      </Box>
    ) : (
      <>
        <Box align="center" justify="center">
          <InfoBox withIcon type="info">
            <Box horizontal flow={5}>
              <Text bold i18nKey={`request:type.${lastRequest.type}`} />
              <Text>request is pending.</Text>
            </Box>
          </InfoBox>
        </Box>
        {userApprovedCurrentStep ? (
          <Box horizontal align="center" justify="center" flow={10}>
            {checkedIcon}
            <Text bold>You already approved the request.</Text>
          </Box>
        ) : userInCurrentStep || isUserCreationRequest ? (
          <Box
            horizontal
            align="center"
            justify="space-between"
            mb={-20}
            mx={-5}
          >
            <AbortRequestButton
              requestID={lastRequest.id}
              onSuccess={onSuccess}
            />
            {!isPendingRegistration && !userApprovedRequest && (
              <ApproveRequestButton
                interactions={approveFlow}
                onSuccess={onSuccess}
                onError={onError}
                additionalFields={{
                  request_id: lastRequest.id,
                  targetType: lastRequest.target_type,
                }}
                disabled={false}
                buttonLabel={
                  <Trans i18nKey={`request:approve.${lastRequest.type}`} />
                }
              />
            )}
          </Box>
        ) : null}
      </>
    );

    return (
      <Box grow flow={20} py={20} style={{ minHeight: 90 }} justify="center">
        {inner}
      </Box>
    );
  }
}

export default withMe(RequestActionButtons);
