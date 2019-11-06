// @flow

import React from "react";
import { Trans } from "react-i18next";
import type { Match } from "react-router-dom";
import { FaAddressBook } from "react-icons/fa";

import type { RestlayEnvironment } from "restlay/connectData";
import { createAndApprove } from "device/interactions/hsmFlows";
import connectData from "restlay/connectData";
import WhitelistQuery from "api/queries/WhitelistQuery";
import EditWhitelistDescriptionMutation from "api/mutations/EditWhitelistDescriptionMutation";
import MultiStepsFlow from "components/base/MultiStepsFlow";
import Text from "components/base/Text";
import Button from "components/base/Button";
import Box from "components/base/Box";
import MultiStepsSuccess from "components/base/MultiStepsFlow/MultiStepsSuccess";
import ApproveRequestButton from "components/ApproveRequestButton";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import type { Address } from "data/types";
import { handleCancelOnDevice } from "utils/request";
import {
  hasEditOccuredGeneric,
  onlyDescriptionChangedGeneric,
} from "utils/creationFlows";
import type { WhitelistCreationPayload } from "./types";

import WhitelistCreationInfos from "./WhitelistCreationInfos";
import WhitelistCreationAddresses from "./WhitelistCreationAddresses";
import WhitelistCreationConfirmation from "./WhitelistCreationConfirmation";

export const initialAddress = {
  id: 1,
  name: "",
  address: "",
  currency: null,
  isValid: false,
};
const initialPayload: WhitelistCreationPayload = {
  name: "",
  description: "",
  addresses: [],
};

export const hasAtLeastOneAddress = (addresses: Address[]) =>
  addresses.length >= 1 &&
  addresses[0].name !== "" &&
  addresses[0].currency !== null &&
  addresses[0].address !== "";

const steps = [
  {
    id: "details",
    name: "Details",
    Step: WhitelistCreationInfos,
  },
  {
    id: "addresses",
    name: "Add addresses",
    Step: WhitelistCreationAddresses,
    requirements: (payload: WhitelistCreationPayload) => payload.name !== "",
  },
  {
    id: "confirmation",
    name: "Confirmation",
    Step: WhitelistCreationConfirmation,
    requirements: (payload: WhitelistCreationPayload) =>
      hasAtLeastOneAddress(payload.addresses),
    Cta: ({
      payload,
      initialPayload,
      onClose,
      isEditMode,
      restlay,
      onSuccess,
    }: {
      payload: WhitelistCreationPayload,
      initialPayload: WhitelistCreationPayload,
      isEditMode?: boolean,
      restlay: RestlayEnvironment,
      onSuccess: () => void,
      onClose: () => void,
    }) => {
      // if only description changed
      if (onlyDescriptionChangedGeneric(payload, initialPayload, "addresses")) {
        return <UpdateDescriptionButton payload={payload} onClose={onClose} />;
      }
      return (
        <ApproveRequestButton
          interactions={
            isEditMode && payload.description !== initialPayload.description
              ? [editDescriptionMutation, ...createAndApprove("WHITELIST")]
              : createAndApprove("WHITELIST")
          }
          onError={handleCancelOnDevice(restlay, onClose)}
          onSuccess={() => {
            onSuccess();
          }}
          disabled={
            !hasEditOccuredGeneric(payload, initialPayload, "addresses")
          }
          additionalFields={{
            type: isEditMode ? "EDIT_WHITELIST" : "CREATE_WHITELIST",
            data: payload,
            description: payload.description,
          }}
          buttonLabel={
            <Trans
              i18nKey={`whitelists:${isEditMode ? "update" : "create"}.submit`}
            />
          }
        />
      );
    },
  },
  {
    id: "finish",
    name: "finish",
    hideBack: true,
    Step: ({ isEditMode }: { isEditMode?: boolean }) => {
      return (
        <MultiStepsSuccess
          title={
            isEditMode ? (
              <Trans i18nKey="whitelists:update.finishTitle" />
            ) : (
              <Trans i18nKey="whitelists:create.finishTitle" />
            )
          }
          desc={
            isEditMode ? (
              <Trans i18nKey="whitelists:update.finishDesc" />
            ) : (
              <Trans i18nKey="whitelists:create.finishDesc" />
            )
          }
        />
      );
    },
    Cta: ({ onClose }: { onClose: () => void }) => {
      return (
        <Box my={10}>
          <Button type="filled" onClick={onClose}>
            <Trans i18nKey="common:done" />
          </Button>
        </Box>
      );
    },
  },
];

const WhitelistCreation = connectData(
  props => (
    <GrowingCard>
      <MultiStepsFlow
        Icon={FaAddressBook}
        title={<Trans i18nKey="whitelists:create.title" />}
        steps={steps}
        additionalProps={props}
        onClose={props.close}
        initialPayload={initialPayload}
      />
    </GrowingCard>
  ),
  {
    RenderLoading: GrowingSpinner,
  },
);
const WhitelistEdit = connectData(
  props => (
    <GrowingCard>
      <MultiStepsFlow
        Icon={FaAddressBook}
        title={
          <Text>
            <Trans i18nKey="whitelists:create.editTitle" />:{" "}
            {props.whitelist.name}
          </Text>
        }
        isEditMode
        steps={steps}
        additionalProps={props}
        onClose={props.close}
        initialPayload={props.whitelist}
      />
    </GrowingCard>
  ),
  {
    RenderLoading: GrowingSpinner,
    queries: {
      whitelist: WhitelistQuery,
    },
    propsToQueryParams: props => ({
      whitelistId: props.whitelistId || "",
    }),
  },
);

const Wrapper = ({ match, close }: { match: Match, close: Function }) => {
  if (match.params.whitelistId) {
    return (
      <WhitelistEdit whitelistId={match.params.whitelistId} close={close} />
    );
  }
  return <WhitelistCreation close={close} />;
};

export default Wrapper;

const editDescriptionMutation = {
  responseKey: "edit_description",
  action: ({ restlay, data, description }) =>
    restlay.commitMutation(
      new EditWhitelistDescriptionMutation({
        whitelistId: data.whitelistId,
        description,
      }),
    ),
};

const UpdateDescriptionButton = connectData(
  (props: {
    restlay: RestlayEnvironment,
    onClose: () => void,
    payload: WhitelistCreationPayload,
  }) => {
    const { restlay, payload, onClose } = props;
    const submit = async () => {
      if (!payload.id) return;
      await restlay.commitMutation(
        new EditWhitelistDescriptionMutation({
          whitelistId: payload.id,
          description: payload.description,
        }),
      );
      onClose();
    };

    return (
      <Button data-test="edit-desc-button" onClick={submit}>
        Edit whitelist
      </Button>
    );
  },
);
