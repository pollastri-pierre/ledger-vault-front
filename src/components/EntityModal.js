// @flow

import React from "react";
import { Trans } from "react-i18next";
import { MdEdit } from "react-icons/md";
import { withRouter, matchPath } from "react-router";
import type { Location } from "react-router-dom";

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
  children: React$Element<*>[],
  growing?: boolean,
  revokeButton?: React$Node,
};

function EntityModal(props: Props) {
  const {
    growing,
    Icon,
    title,
    onClose,
    children,
    location,
    entity,
    revokeButton,
  } = props;

  const onClickEdit = () => {
    // console.log(`clicking edit`);
  };

  const lastRequest = <EntityLastRequest key="lastRequest" entity={entity} />;

  const childs = Array.isArray(children) ? children : [children];

  const content =
    [...childs, lastRequest].find(child => {
      if (!child || typeof child === "string") return false;
      const path = `*/${child.key || ""}`;
      return matchPath(location.pathname, { path, exact: true });
    }) || childs[0];

  const inner = (
    <>
      <RichModalHeader title={title} Icon={Icon} onClose={onClose}>
        <RichModalTabsContainer>
          {childs.map(child => (
            <RichModalTab
              key={child.key}
              to={child.key}
              isActive={child === content}
            >
              <Trans i18nKey={`entityModal:tabs.${child.key || ""}`} />
            </RichModalTab>
          ))}
        </RichModalTabsContainer>
        {hasPendingRequest(entity) ? (
          <RichModalTab to="lastRequest" isActive={content === lastRequest}>
            <Trans i18nKey="entityModal:tabs.lastRequest" />
          </RichModalTab>
        ) : (
          <EditButton onClick={onClickEdit} />
        )}
      </RichModalHeader>

      <Box width={600} p={40} style={{ minHeight: 200 }}>
        {content}
      </Box>

      <RichModalFooter>
        {hasPendingRequest(entity) ? (
          <RequestActionButtons onSuccess={onClose} entity={entity} />
        ) : entity.status === "ACTIVE" && revokeButton ? (
          revokeButton
        ) : null}
      </RichModalFooter>
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
