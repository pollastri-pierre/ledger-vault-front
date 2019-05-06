// @flow

import React from "react";
import { Trans } from "react-i18next";
import { MdEdit } from "react-icons/md";
import { withRouter, matchPath } from "react-router";
import { Link } from "react-router-dom";
import type { Location, Match } from "react-router-dom";

import {
  RichModalHeader,
  RichModalFooter,
  RichModalTabsContainer,
  RichModalTab,
} from "components/base/Modal";
import Button from "components/base/Button";
import GrowingCard from "components/base/GrowingCard";
import EntityLastRequest from "components/EntityLastRequest";
import RequestActionButtons from "components/RequestActionButtons";
import { Badge } from "containers/Admin/Dashboard/PendingBadge";
import Box from "components/base/Box";
import { hasPendingRequest } from "utils/entities";
import type { Entity } from "data/types";

const EDIT_ALLOWED_STATUS = ["ACTIVE", "VIEW_ONLY", "MIGRATED"];

type Props<T> = {
  entity: Entity,
  title: React$Node,
  Icon: React$ComponentType<*>,
  onClose: () => void,
  location: Location,
  match: Match,
  children: React$Element<*>[],
  growing?: boolean,
  revokeButton?: React$Node,
  footer?: React$Node,
  editURL?: string,
  additionalFields?: T,
};

function EntityModal<T>(props: Props<T>) {
  const {
    growing,
    Icon,
    title,
    onClose,
    children,
    location,
    match,
    entity,
    editURL,
    revokeButton,
    footer,
    additionalFields,
  } = props;

  const fullEditURL =
    editURL && match.params["0"] ? `${match.params["0"]}${editURL}` : null;

  const lastRequest = (
    <EntityLastRequest
      key="pendingRequest"
      entity={entity}
      additionalFields={additionalFields}
    />
  );

  const childs = Array.isArray(children) ? children : [children];

  const content =
    [...childs, lastRequest].find(child => {
      if (!child || typeof child === "string") return false;
      const path = `*/${child.key || ""}`;
      return matchPath(location.pathname, { path, exact: true });
    }) || childs[0];

  const hasPendingReq = hasPendingRequest(entity);
  const showRevoke = entity.status === "ACTIVE" && revokeButton;
  const showFooter =
    entity.status !== "PENDING_REGISTRATION" &&
    (hasPendingReq || showRevoke || footer);

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
                <Trans i18nKey={`entityModal:tabs.${child.key || ""}`} />
              </RichModalTab>
            ) : null,
          )}
        </RichModalTabsContainer>
        {hasPendingReq ? (
          <RichModalTab to="pendingRequest" isActive={content === lastRequest}>
            <Box horizontal align="center">
              <Trans i18nKey="entityModal:tabs.pendingRequest" />
              <Badge style={{ marginLeft: 5 }}>1</Badge>
            </Box>
          </RichModalTab>
        ) : fullEditURL && EDIT_ALLOWED_STATUS.includes(entity.status) ? (
          <EditButton url={fullEditURL} />
        ) : null}
      </RichModalHeader>

      <Box width={600} p={40} style={{ minHeight: 300 }}>
        {content}
      </Box>

      {showFooter && (
        <RichModalFooter>
          {hasPendingReq ? (
            <RequestActionButtons onSuccess={onClose} entity={entity} />
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

function EditButton({ url }: { url: string }) {
  return (
    <Link replace to={url}>
      <Button size="tiny" type="submit" variant="filled" IconLeft={MdEdit}>
        <Trans i18nKey="entityModal:edit" />
      </Button>
    </Link>
  );
}

export default withRouter(EntityModal);
