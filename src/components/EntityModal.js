// @flow

import React, { useEffect } from "react";
import type { MemoryHistory } from "history";
import { useTranslation } from "react-i18next";
import { FaPen } from "react-icons/fa";
import { withRouter, matchPath } from "react-router";
import { Link } from "react-router-dom";
import type { Location, Match } from "react-router-dom";
import Tooltip from "components/base/Tooltip";

import {
  RichModalHeader,
  RichModalTabsContainer,
  RichModalTab,
} from "components/base/Modal";

import Disabled from "components/Disabled";
import { withMe } from "components/UserContextProvider";
import Button from "components/base/Button";
import GrowingCard from "components/base/GrowingCard";
import EntityLastRequest from "components/EntityLastRequest";
import EntityFooter from "components/EntityFooter";
import { Badge } from "containers/Admin/Dashboard/PendingBadge";
import Box from "components/base/Box";
import Absolute from "components/base/Absolute";
import { hasPendingRequest, hasPendingEdit } from "utils/entities";
import type { RevokeParams } from "components/EntityFooter";
import type { Entity, User } from "data/types";

export const EDIT_ALLOWED_STATUS = ["ACTIVE", "VIEW_ONLY", "MIGRATED"];

type Props<T> = {|
  entity: Entity,
  title: React$Node,
  Icon: React$ComponentType<*>,
  onClose: () => void,
  location: Location,
  match: Match,
  children: React$Element<*>[],
  growing?: boolean,
  me: User,
  footer?: React$Node,
  editURL?: string,
  disableEdit?: boolean,
  customWidth?: number,
  additionalFields?: T,
  revokeParams?: RevokeParams,
  history: MemoryHistory,
  refreshDataQuery: (void) => void,
|};

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
    footer,
    customWidth,
    additionalFields,
    revokeParams,
    history,
    refreshDataQuery,
  } = props;
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

  const childs = Array.isArray(children) ? children : [children];

  const content =
    [...childs, lastRequest].find((child) => {
      if (!child || typeof child === "string") return false;
      const path = `*/${child.key || ""}`;
      return matchPath(location.pathname, { path, exact: true });
    }) || childs[0];

  const hasPendingReq = hasPendingRequest(entity);
  const isPendingEdit = hasPendingEdit(entity);

  // when user is on edit tab and reject/approve the request, the edit tab will not exist
  // anymore after the request finished, so we need to bring him back to first tab
  useEffect(() => {
    // if request is not in pending edit and we are on edit tab
    if (!isPendingEdit && content.key === "editRequest") {
      const path = `*/${childs[0].key || ""}`;
      history.push(path);
    }
  }, [childs, content.key, entity, history, isPendingEdit]);

  const inner = (
    <>
      <RichModalHeader title={title} Icon={Icon} onClose={onClose}>
        <RichModalTabsContainer>
          {childs.map((child) =>
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

      <Box width={customWidth || 600} p={40} style={{ minHeight: 300 }}>
        {content}
      </Box>

      <EntityFooter
        captureRefs
        entity={entity}
        onFinish={onClose}
        customContent={footer}
        revokeParams={revokeParams}
        refreshDataQuery={refreshDataQuery}
      />
    </>
  );

  return growing ? <GrowingCard>{inner}</GrowingCard> : inner;
}

function EditButton({ url, disabled }: { url: string, disabled?: boolean }) {
  const { t } = useTranslation();
  const inner = (
    <Link replace to={url} data-test="edit-button">
      <Tooltip content={t("entityModal:edit")}>
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
