// @flow

import { FaCheckCircle, FaCheck, FaHourglassHalf } from "react-icons/fa";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { MdTimer, MdKeyboardBackspace } from "react-icons/md";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { RichModalFooter, ConfirmModal } from "components/base/Modal";
import { useOrganization } from "components/OrganizationContext";
import type {
  Interaction,
  DeviceInteractionError,
} from "components/DeviceInteraction";
import DeviceInteraction from "components/DeviceInteraction";
import TranslatedError from "components/TranslatedError";
import { useMe } from "components/UserContextProvider";
import DateFormat from "components/DateFormat";
import Spinner from "components/base/Spinner";
import InfoBox from "components/base/InfoBox";
import Slider from "components/base/Slider";
import Button from "components/base/Button";
import Text from "components/base/Text";
import Box from "components/base/Box";
import { DEVICE_REJECT_ERROR_CODE } from "device/constants";

import AbortRequestMutation from "api/mutations/AbortRequestMutation";
import RequestsQuery from "api/queries/RequestsQuery";
import Query from "restlay/Query";

import { extractErrorContent } from "utils/errors";
import { approveFlow, createAndApprove } from "device/interactions/hsmFlows";
import connectData from "restlay/connectData";
import colors from "shared/colors";

import {
  hasUserApprovedRequest,
  isUserInCurrentStep,
  isRequestAffectingAdminRules,
} from "utils/request";
import { hasPendingRequest } from "utils/entities";
import { minWait } from "utils/promise";

import type { Entity, Request, GenericRequest } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";

export type RevokeParams = {
  buttonLabel: React$Node,
  confirmTitle: React$Node,
  confirmLabel: React$Node,
  confirmContent: React$Node,
};

type Props = {|
  entity: Entity,
  customContent?: React$Node,
  onFinish?: () => void,
  captureRefs?: boolean,
  revokeParams?: RevokeParams,
  restlay: RestlayEnvironment,
  refreshDataQuery?: typeof Query,
|};

const SLIDES = {
  initial: 0,
  action: 1,
  result: 2,
};

const checkedIcon = <FaCheckCircle color={colors.paleGreenAlt} size={20} />;

type Action =
  | { type: "callback", payload: (RestlayEnvironment) => Promise<any> }
  | {
      type: "device",
      payload: Interaction[],
      additionalFields: {
        type?: string,
        request_id?: number,
        targetType?: string,
      },
    };

function EntityFooter(props: Props) {
  const {
    entity: originalEntity,
    customContent,
    restlay,
    onFinish,
    captureRefs,
    revokeParams,
    refreshDataQuery,
  } = props;

  const { refresh: refreshOrganization } = useOrganization();
  const { t } = useTranslation();

  // prevent to be affected by entity/req update, which is happening once the
  // mutation has been triggered and so the entity is refreshing under
  // the hoods (we still want to render the success state)
  const entityRef = useRef(originalEntity);
  const requestRef = useRef(originalEntity.last_request);
  const entity = captureRefs ? entityRef.current : originalEntity;
  const request = captureRefs ? requestRef.current : entity.last_request;

  const firstRender = useRef(true);
  const [isRevokeModalOpened, setRevokeModalOpened] = useState(false);
  const [slide, setSlide] = useState(SLIDES.initial);
  const [action, setAction] = useState<?Action>(null);
  const [error, setError] = useState<?DeviceInteractionError>(null);

  const isRequestPending = hasPendingRequest(entity);
  const canBeRevoked = entity.status === "ACTIVE" && !!revokeParams;

  const onReset = () => {
    setSlide(SLIDES.initial);
    setAction(null);
    setError(null);
  };

  const handleFinish = onFinish || onReset;

  const onRetry = () => {
    if (!action) return;
    if (action.type === "callback") runCallbackAction(action);
    if (action.type === "device") runDeviceAction(action);
  };

  // TODO this seems weird to handle that here, IMO refreshing the admin
  // rules logic should be handled in the mutation itself
  const triggerPostSuccessSideEffects = useCallback(() => {
    if (!request) return;
    if (isRequestAffectingAdminRules(request)) {
      refreshOrganization();
    }
  }, [refreshOrganization, request]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onReset();
  }, [entity, firstRender, setSlide, setError]);

  const runCallbackAction = async (action: Action) => {
    if (action.type !== "callback") return;
    setAction(action);
    setSlide(SLIDES.action);
    try {
      await minWait(action.payload(restlay), 300);
      // TODO check if unmounted
      setError(null);
      setSlide(SLIDES.result);
      triggerPostSuccessSideEffects();
    } catch (err) {
      handleError(err);
    }
  };

  const runDeviceAction = async (action: Action) => {
    if (action.type !== "device") return;
    setAction(action);
    setSlide(SLIDES.action);
  };

  const abortRequest = useCallback(async () => {
    if (!request) return;
    await restlay.commitMutation(
      new AbortRequestMutation({ requestID: request.id }),
    );
    if (refreshDataQuery) {
      await restlay.fetchQuery(refreshDataQuery);
    }
    await restlay.fetchQuery(
      new RequestsQuery({
        status: ["PENDING_APPROVAL", "PENDING_REGISTRATION"],
        pageSize: -1,
        order: "asc",
      }),
    );
  }, [request, restlay, refreshDataQuery]);

  const handleError = (err) => {
    const isBlockingReasons =
      !!err && !!err.json && !!err.json.blocking_reasons;

    const userCancelOnDevice =
      err && err.statusCode === DEVICE_REJECT_ERROR_CODE;

    if (isBlockingReasons || userCancelOnDevice) {
      onReset();
      return;
    }
    setError(err);
    setSlide(SLIDES.result);
  };

  const onAbort = () =>
    runCallbackAction({ type: "callback", payload: abortRequest });

  const onApprove = () => {
    if (!request) return;
    runDeviceAction({
      type: "device",
      payload: approveFlow(request.target_type),
      additionalFields: {
        request_id: request.id,
        targetType: request.target_type,
      },
    });
  };

  const onRevoke = () =>
    runDeviceAction({ type: "device", ...prepareAbortEntityData(entity) });

  const onDeviceSuccess = async () => {
    setSlide(SLIDES.result);
    triggerPostSuccessSideEffects();
    if (refreshDataQuery) {
      await restlay.fetchQuery(refreshDataQuery);
    }
  };

  const inner =
    request && isRequestPending ? (
      <PendingRequest
        request={request}
        onApprove={onApprove}
        onAbort={onAbort}
      />
    ) : canBeRevoked ? (
      <Box horizontal p={20}>
        <Button
          type="filled"
          variant="danger"
          onClick={() => setRevokeModalOpened(true)}
        >
          {revokeParams && revokeParams.buttonLabel
            ? revokeParams.buttonLabel
            : t(`request:type.REVOKE_${entity.entityType}`)}
        </Button>

        {!!revokeParams && (
          <ConfirmModal
            isOpened={isRevokeModalOpened}
            onConfirm={() => {
              setRevokeModalOpened(false);
              onRevoke();
            }}
            onReject={() => setRevokeModalOpened(false)}
            title={revokeParams.confirmTitle}
            confirmLabel={revokeParams.confirmLabel}
          >
            {revokeParams.confirmContent}
          </ConfirmModal>
        )}
      </Box>
    ) : (
      customContent || null
    );

  if (!inner) return null;

  const shouldAllowOverflow =
    slide === SLIDES.action && action && action.type === "device";

  return (
    <Container style={{ overflow: shouldAllowOverflow ? "visible" : "hidden" }}>
      <Slider slide={slide}>
        {/* CONTENT */}
        {/* ======= */}
        <Box grow>{inner}</Box>

        {/* LOADING */}
        {/* ======= */}
        <Box grow align="center" justify="center">
          {/* DEVICE INTERACTION */}

          {!!action && action.type === "device" && slide === SLIDES.action && (
            <DeviceInteraction
              interactions={action.payload}
              noCheckVersion
              onSuccess={onDeviceSuccess}
              onError={handleError}
              additionalFields={action.additionalFields}
            />
          )}

          {/* CALLBACK INTERACTION */}

          {!!action && action.type === "callback" && (
            <Box flow={20} align="center">
              <InfoBox type="info">Sending request...</InfoBox>
              <Spinner />
            </Box>
          )}
        </Box>

        {/* RESULT */}
        {/* ====== */}
        <Box grow align="center" justify="center">
          {error ? (
            <Box flow={10} align="center">
              <InfoBox type="error">
                <div>
                  <span style={{ fontWeight: "bold", marginRight: 5 }}>
                    Error
                  </span>{" "}
                  {error.json ? (
                    extractErrorContent(error, null)
                  ) : (
                    <TranslatedError field="description" error={error} />
                  )}
                </div>
              </InfoBox>
              <Box horizontal flow={10}>
                <Button size="small" type="link" onClick={onReset}>
                  <Box horizontal align="center" flow={5}>
                    <MdKeyboardBackspace />
                    <span>Go back</span>
                  </Box>
                </Button>
                <Button size="small" type="filled" onClick={onRetry}>
                  Retry
                </Button>
              </Box>
            </Box>
          ) : request && action ? (
            <Box flow={10} align="center">
              <InfoBox type="success">
                <Box
                  horizontal
                  align="center"
                  flow={5}
                  data-test="successfull_message"
                >
                  <FaCheck />
                  <span>
                    Successfully{" "}
                    {action.payload === abortRequest ? "rejected" : "approved"}
                  </span>
                  <Text
                    fontWeight="bold"
                    i18nKey={`request:type.${reqOrActionType(request, action)}`}
                  />
                </Box>
              </InfoBox>
              <Button
                size="small"
                type="filled"
                data-test="done_button"
                onClick={handleFinish}
              >
                {t("common:done")}
              </Button>
            </Box>
          ) : null}
        </Box>
      </Slider>
    </Container>
  );
}

type PendingRequestProps = {
  request: Request<any>,
  onAbort: () => Promise<any>,
  onApprove: () => void,
};

function PendingRequest({ request, onAbort, onApprove }: PendingRequestProps) {
  const me = useMe();
  const { t } = useTranslation();
  const userApprovedRequest = hasUserApprovedRequest(request, me);
  const userInCurrentStep = isUserInCurrentStep(request, me);
  const [isRejectModalOpened, setRejectModalOpened] = useState(false);

  // we always want to display abort button if it's a user creation request
  // to allow aborting an invitation link
  const isUserCreationRequest =
    request.type === "CREATE_OPERATOR" || request.type === "CREATE_ADMIN";

  return (
    <Box flow={20} align="center">
      <Box align="center" flow={10}>
        <InfoBox type="info">
          <Box horizontal flow={5} align="center">
            <FaHourglassHalf />
            <Text fontWeight="bold" i18nKey={`request:type.${request.type}`} />
            <Text> request is pending.</Text>
          </Box>
        </InfoBox>
        <Box horizontal align="center" flow={5}>
          <MdTimer />
          <Text size="small">
            expires on <DateFormat date={request.expired_at} />
          </Text>
        </Box>
        <ConfirmModal
          isOpened={isRejectModalOpened}
          isConfirmRed
          onConfirm={() => {
            setRejectModalOpened(false);
            onAbort();
          }}
          onReject={() => setRejectModalOpened(false)}
          title={<Text i18nKey="request:reject_confirm_title" />}
          confirmLabel="Reject"
        >
          <Text i18nKey="request:reject_confirm_content" />
        </ConfirmModal>
      </Box>
      {userApprovedRequest ? (
        <Emphasis>
          {checkedIcon}
          <Text>You already approved this request</Text>
          <Button
            size="small"
            type="filled"
            variant="danger"
            data-test="reject-button"
            onClick={() => setRejectModalOpened(true)}
          >
            {t("common:abort")}
          </Button>
        </Emphasis>
      ) : userInCurrentStep ? (
        <Box alignSelf="stretch" horizontal justify="space-between">
          <Button
            type="filled"
            variant="danger"
            data-test="reject-button"
            onClick={() => setRejectModalOpened(true)}
          >
            {t("common:abort")}
          </Button>
          <Button
            type="filled"
            variant="primary"
            onClick={onApprove}
            data-test="approve_button"
          >
            {t(`request:approve.${request.type}`)}
          </Button>
        </Box>
      ) : isUserCreationRequest ? (
        <Emphasis>
          {checkedIcon}
          <Text>Invitation has been created</Text>
          <Button
            size="small"
            type="filled"
            variant="danger"
            data-test="reject-button"
            onClick={() => setRejectModalOpened(true)}
          >
            {t("common:reject")}
          </Button>
        </Emphasis>
      ) : null}
    </Box>
  );
}

// in the case of a revoke, we don't want to display a success
// message based on the last_request type, but rather on the
// action just made. else, we just extract it from last_request
function reqOrActionType(request: GenericRequest, action: Action) {
  return action.type === "device" &&
    action.additionalFields &&
    action.additionalFields.type
    ? action.additionalFields.type
    : request.type;
}

function prepareAbortEntityData(entity) {
  const { entityType, id } = entity;
  const gateCompatibleEntityType =
    entityType === "USER" ? "PERSON" : entityType;
  return {
    payload: createAndApprove(gateCompatibleEntityType),
    additionalFields: {
      type: `REVOKE_${entityType}`,
      data:
        entityType === "USER"
          ? { user_id: id }
          : entityType === "GROUP"
          ? { group_id: id }
          : null,
    },
  };
}

const Container = styled(RichModalFooter)`
  display: block;
  padding: 0;
  min-height: auto;
`;

const Emphasis = styled(Box).attrs({
  horizontal: true,
  align: "center",
  justify: "center",
  flow: 10,
  p: 10,
  pr: 5,
})`
  height: 40px;
  background: white;
  border-radius: 4px;
  border: 1px dashed ${colors.form.border};
`;

export default connectData(EntityFooter);
