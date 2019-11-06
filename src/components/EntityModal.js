// @flow

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPen } from "react-icons/fa";
import { withRouter, matchPath } from "react-router";
import { Link } from "react-router-dom";
import type { Location, Match } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

import {
  RichModalHeader,
  RichModalFooter,
  RichModalTabsContainer,
  RichModalTab,
} from "components/base/Modal";

import { useOrganization } from "components/OrganizationContext";
import Disabled from "components/Disabled";
import { withMe } from "components/UserContextProvider";
import Button from "components/base/Button";
import GrowingCard from "components/base/GrowingCard";
import EntityLastRequest from "components/EntityLastRequest";
import RequestActionButtons from "components/RequestActionButtons";
import { Badge } from "containers/Admin/Dashboard/PendingBadge";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Absolute from "components/base/Absolute";
import { hasPendingRequest, hasPendingEdit } from "utils/entities";
import { isRequestAffectingAdminRules } from "utils/request";
import type { Entity, User } from "data/types";

import colors, { lighten, darken } from "shared/colors";

export const EDIT_ALLOWED_STATUS = ["ACTIVE", "VIEW_ONLY", "MIGRATED"];

type Props<T> = {
  entity: Entity,
  title: React$Node,
  Icon: React$ComponentType<*>,
  onClose: () => void,
  location: Location,
  match: Match,
  children: React$Element<*>[],
  growing?: boolean,
  me: User,
  revokeButton?: React$Node,
  footer?: React$Node,
  editURL?: string,
  disableEdit?: boolean,
  additionalFields?: T,
};

function EntityModal<T>(props: Props<T>) {
  const {
    growing,
    Icon,
    title,
    me,
    onClose,
    children,
    location,
    match,
    entity,
    editURL,
    disableEdit,
    revokeButton,
    footer,
    additionalFields,
  } = props;
  const [successMessage, setSuccessMessage] = useState(false);
  const [actionType, setActionType] = useState(null);
  const { t } = useTranslation();

  const fullEditURL =
    editURL && match.params["0"] ? `${match.params["0"]}${editURL}` : null;

  const lastRequest = (
    <EntityLastRequest
      key="editRequest"
      entity={entity}
      additionalFields={additionalFields}
    />
  );

  const { refresh } = useOrganization();
  const onSuccess = (successRes?: { actionType: string }) => {
    // FIXME technically we should also check if the quorum has been reached
    if (
      entity.last_request &&
      isRequestAffectingAdminRules(entity.last_request)
    ) {
      refresh();
    }

    setActionType(successRes ? successRes.actionType : null);
    setSuccessMessage(true);
  };

  const childs = Array.isArray(children) ? children : [children];

  const content =
    [...childs, lastRequest].find(child => {
      if (!child || typeof child === "string") return false;
      const path = `*/${child.key || ""}`;
      return matchPath(location.pathname, { path, exact: true });
    }) || childs[0];

  const hasPendingReq = hasPendingRequest(entity);
  const isPendingEdit = hasPendingEdit(entity);
  const isEntityBlocked = entity.status === "BLOCKED";
  const isLastRequestBlocked =
    entity.last_request && entity.last_request.status === "BLOCKED";
  const showRevoke =
    (entity.status === "ACTIVE" || entity.status === "ACCESS_SUSPENDED") &&
    revokeButton;
  const showFooter =
    hasPendingReq || showRevoke || footer || isLastRequestBlocked;

  const inner = (
    <>
      <RichModalHeader title={title} Icon={Icon} onClose={onClose}>
        <RichModalTabsContainer>
          {childs.map(child =>
            child ? (
              <RichModalTab
                key={child.key}
                to={child.key}
                isActive={child === content}
              >
                {t(`entityModal:tabs.${child.key || ""}`)}
              </RichModalTab>
            ) : null,
          )}
        </RichModalTabsContainer>
        {hasPendingReq && isPendingEdit ? (
          <RichModalTab
            dark
            to="editRequest"
            isActive={content === lastRequest}
          >
            <Box horizontal align="center">
              {t("entityModal:tabs.editRequest")}
              <Absolute top={-6} right={-8}>
                <Badge>1</Badge>
              </Absolute>
            </Box>
          </RichModalTab>
        ) : fullEditURL &&
          !hasPendingReq &&
          EDIT_ALLOWED_STATUS.includes(entity.status) &&
          me.role === "ADMIN" ? (
          <EditButton disabled={disableEdit} url={fullEditURL} />
        ) : null}
      </RichModalHeader>

      <Box width={600} p={40} style={{ minHeight: 300 }}>
        {content}
      </Box>

      {showFooter && (
        <RichModalFooter>
          {successMessage ? (
            <SuccessFooter actionType={actionType} onClose={onClose} />
          ) : hasPendingReq || isEntityBlocked ? (
            <RequestActionButtons onSuccess={onSuccess} entity={entity} />
          ) : showRevoke ? (
            revokeButton || null
          ) : (
            footer || null
          )}
        </RichModalFooter>
      )}
    </>
  );

  return growing ? <GrowingCard>{inner}</GrowingCard> : inner;
}

function EditButton({ url, disabled }: { url: string, disabled?: boolean }) {
  const { t } = useTranslation();
  const inner = (
    <Link replace to={url} data-test="edit-button">
      <Tooltip title={t("entityModal:edit")} placement="left">
        <Button>
          <FaPen />
        </Button>
      </Tooltip>
    </Link>
  );

  if (disabled) {
    return <Disabled disabled={disabled}>{inner}</Disabled>;
  }

  return inner;
}

export default withRouter(withMe(EntityModal));

type SuccessFooterProps = {
  actionType: ?string,
  onClose: () => void,
};
function SuccessFooter(props: SuccessFooterProps) {
  const { t } = useTranslation();
  return (
    <Box horizontal grow justify="space-between">
      <Box
        justify="center"
        align="center"
        borderRadius={5}
        bg={lighten(colors.paleGreen, 0.06)}
        px={10}
      >
        <Text
          data-test="successfull_message"
          fontWeight="semiBold"
          textAlign="center"
          color={darken(colors.paleGreen, 0.7)}
          i18nKey="entityModal:successMessage"
          values={{
            action:
              props.actionType === "abort"
                ? t("entityModal:actionType.rejected")
                : t("entityModal:actionType.approved"),
          }}
        />
      </Box>
      <Button
        data-test="done_button"
        variant="primary"
        type="filled"
        onClick={props.onClose}
      >
        {t("common:done")}
      </Button>
    </Box>
  );
}
