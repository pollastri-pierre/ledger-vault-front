// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import omit from "lodash/omit";
import type { Match } from "react-router-dom";
import { FaAddressBook } from "react-icons/fa";

import type { RestlayEnvironment } from "restlay/connectData";
import { createAndApprove } from "device/interactions/hsmFlows";
import connectData from "restlay/connectData";
import WhitelistQuery from "api/queries/WhitelistQuery";
import EditWhitelistDescriptionMutation from "api/mutations/EditWhitelistDescriptionMutation";
import { resetRequest } from "redux/modules/requestReplayStore";
import MultiStepsFlow from "components/base/MultiStepsFlow";
import Text from "components/base/Text";
import Button from "components/base/Button";
import Box from "components/base/Box";
import MultiStepsSuccess from "components/base/MultiStepsFlow/MultiStepsSuccess";
import ApproveRequestButton from "components/ApproveRequestButton";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import type { Address, Whitelist } from "data/types";
import { handleCancelOnDevice } from "utils/request";
import {
  onlyDescriptionChangedWhitelist,
  hasEditOccuredWhitelist,
} from "utils/creationFlows";
import type {
  EditWhitelistReplay,
  CreateWhitelistReplay,
} from "redux/modules/requestReplayStore";
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
    name: "Addresses",
    Step: WhitelistCreationAddresses,
    requirements: (payload: WhitelistCreationPayload) => payload.name !== "",
    width: 880,
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
      payloadToCompareTo,
    }: {
      payload: WhitelistCreationPayload,
      payloadToCompareTo: WhitelistCreationPayload,
      initialPayload: WhitelistCreationPayload,
      isEditMode?: boolean,
      restlay: RestlayEnvironment,
      onSuccess: () => void,
      onClose: () => void,
    }) => {
      const { t } = useTranslation();
      // if only description changed
      if (onlyDescriptionChangedWhitelist(payload, payloadToCompareTo)) {
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
          disabled={!hasEditOccuredWhitelist(payload, payloadToCompareTo)}
          additionalFields={{
            type: isEditMode ? "EDIT_WHITELIST" : "CREATE_WHITELIST",
            data: serializePayload(payload, initialPayload),
            description: payload.description,
          }}
          buttonLabel={t(
            `whitelists:${isEditMode ? "update" : "create"}.submit`,
          )}
        />
      );
    },
  },
  {
    id: "finish",
    name: "finish",
    hideBack: true,
    Step: ({ isEditMode }: { isEditMode?: boolean }) => {
      const { t } = useTranslation();
      return (
        <MultiStepsSuccess
          title={t(
            isEditMode
              ? "whitelists:update.finishTitle"
              : "whitelists:create.finishTitle",
          )}
          desc={t(
            isEditMode
              ? "whitelists:update.finishDesc"
              : "whitelists:create.finishDesc",
          )}
        />
      );
    },
    Cta: ({ onClose }: { onClose: () => void }) => {
      const { t } = useTranslation();
      return (
        <Box my={10}>
          <Button type="filled" onClick={onClose}>
            {t("common:done")}
          </Button>
        </Box>
      );
    },
  },
];

const WhitelistCreation = connectData(
  props => {
    const { t } = useTranslation();
    return (
      <GrowingCard>
        <MultiStepsFlow
          Icon={FaAddressBook}
          title={t("whitelists:create.title")}
          steps={steps}
          additionalProps={props}
          onClose={props.close}
          payloadToCompareTo={initialPayload}
          initialPayload={
            props.requestToReplay
              ? purgePayloadCreation(props.requestToReplay.entity)
              : initialPayload
          }
        />
      </GrowingCard>
    );
  },
  {
    RenderLoading: GrowingSpinner,
  },
);
const WhitelistEdit = connectData(
  props => {
    const { t } = useTranslation();
    return (
      <GrowingCard>
        <MultiStepsFlow
          Icon={FaAddressBook}
          title={
            <Text>
              {t("whitelists:create.editTitle")}: {props.whitelist.name}
            </Text>
          }
          isEditMode
          steps={steps}
          additionalProps={props}
          onClose={props.close}
          initialPayload={mergeEditData(props.whitelist, props.requestToReplay)}
          payloadToCompareTo={props.whitelist}
        />
      </GrowingCard>
    );
  },
  {
    RenderLoading: GrowingSpinner,
    queries: {
      whitelist: WhitelistQuery,
    },
    propsToQueryParams: props => ({
      whitelistId: props.whitelistId,
    }),
  },
);

const Wrapper = ({
  match,
  close,
  resetRequest,
  requestToReplay,
}: {
  match: Match,
  close: Function,
  requestToReplay: EditWhitelistReplay | CreateWhitelistReplay,
  resetRequest: void => void,
}) => {
  const closeAndEmptyStore = () => {
    resetRequest();
    close();
  };
  if (match.params.whitelistId) {
    return (
      <WhitelistEdit
        whitelistId={match.params.whitelistId}
        close={closeAndEmptyStore}
        requestToReplay={requestToReplay}
      />
    );
  }
  return (
    <WhitelistCreation
      close={closeAndEmptyStore}
      requestToReplay={requestToReplay}
    />
  );
};

const mapStateToProps = state => ({
  requestToReplay: state.requestReplay,
});
const mapDispatch = {
  resetRequest,
};
export default connect(mapStateToProps, mapDispatch)(Wrapper);

const editDescriptionMutation = {
  responseKey: "edit_description",
  action: ({ restlay, data, description }) =>
    restlay.commitMutation(
      new EditWhitelistDescriptionMutation({
        whitelistId: data.whitelist_id,
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

function mergeEditData(
  whitelist: Whitelist,
  requestToReplay: EditWhitelistReplay | CreateWhitelistReplay,
) {
  if (!requestToReplay || !requestToReplay.edit_data)
    return puregeEditPayload(whitelist);
  const { edit_data } = requestToReplay;
  return {
    id: whitelist.id,
    name: edit_data.name || whitelist.name,
    description: whitelist.description,
    addresses: edit_data.addresses || whitelist.addresses,
  };
}
const puregeEditPayload = (data: Whitelist) => {
  return {
    id: data.id,
    ...purgePayloadCreation(data),
  };
};
const purgePayloadCreation = (data: Whitelist) => {
  return {
    name: data.name,
    description: data.description,
    addresses: data.addresses,
  };
};

function serializePayload(
  payload: WhitelistCreationPayload,
  initialPayload: WhitelistCreationPayload,
) {
  if (!payload.id) return payload;

  // gate doesn't want our fake id :p
  const edit_data: Object = {
    addresses: payload.addresses.map(a => omit(a, ["id"])),
  };

  // the gate doesn't allow to send the name if it didn't change
  if (payload.name !== initialPayload.name) {
    edit_data.name = payload.name;
  }
  return {
    edit_data,
    whitelist_id: payload.id,
  };
}
