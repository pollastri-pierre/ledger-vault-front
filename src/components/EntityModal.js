// @flow

import React from "react";
import { Trans } from "react-i18next";
import { MdEdit } from "react-icons/md";
import { withRouter, matchPath } from "react-router";
import type { Location, Match } from "react-router-dom";
import type { MemoryHistory } from "history";

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
import Box from "components/base/Box";
import { hasPendingRequest } from "utils/entities";
import type { Entity } from "data/types";

type Props = {
  entity: Entity,
  title: React$Node,
  Icon: React$ComponentType<*>,
  onClose: () => void,
  location: Location,
  match: Match,
  history: MemoryHistory,
  children: React$Element<*>[],
  growing?: boolean,
  revokeButton?: React$Node,
  footer?: React$Node,
  editURL?: string,
};

function EntityModal(props: Props) {
  const {
    growing,
    Icon,
    title,
    onClose,
    children,
    location,
    match,
    entity,
    history,
    editURL,
    revokeButton,
    footer,
  } = props;

  const onClickEdit = () => {
    if (match.params["0"] && editURL) {
      history.push(`${match.params["0"]}${editURL}`);
    }
  };

  const lastRequest = <EntityLastRequest key="lastRequest" entity={entity} />;

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
          <RichModalTab to="lastRequest" isActive={content === lastRequest}>
            <Trans i18nKey="entityModal:tabs.lastRequest" />
          </RichModalTab>
        ) : editURL ? (
          <EditButton onClick={onClickEdit} />
        ) : null}
      </RichModalHeader>

      <Box width={600} p={40} style={{ minHeight: 200 }}>
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

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      size="tiny"
      type="submit"
      variant="filled"
      IconLeft={MdEdit}
      onClick={onClick}
    >
      <Trans i18nKey="entityModal:edit" />
    </Button>
  );
}

export default withRouter(EntityModal);
