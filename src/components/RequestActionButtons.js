// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";
import { MdTimer } from "react-icons/md";

import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import DateFormat from "components/DateFormat";
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
        <Box align="center" justify="center" flow={5}>
          <InfoBox withIcon type="info">
            <Box horizontal flow={5}>
              <Text
                fontWeight="bold"
                i18nKey={`request:type.${lastRequest.type}`}
              />
              <Text>request is pending.</Text>
            </Box>
          </InfoBox>
          <Box horizontal align="center" flow={5}>
            <MdTimer />
            <Text size="small">
              expires on <DateFormat date={lastRequest.expired_at} />
            </Text>
          </Box>
        </Box>
        {userApprovedCurrentStep ? (
          <Box horizontal align="center" justify="center" flow={10}>
            {checkedIcon}
            <Text fontWeight="bold">You already approved this request</Text>
          </Box>
        ) : userInCurrentStep || isUserCreationRequest ? (
          <Box pt={20} horizontal justify="space-between" align="flex-end">
            <AbortRequestButton
              requestID={lastRequest.id}
              onSuccess={onSuccess}
            />
            {!isPendingRegistration && !userApprovedRequest && (
              <ApproveRequestButton
                interactions={approveFlow(lastRequest.target_type, {
                  successNotif: true,
                })}
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
      <Box grow flow={20} style={{ minHeight: 90 }} justify="center">
        {inner}
      </Box>
    );
  }
}

export default withMe(RequestActionButtons);
