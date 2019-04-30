// @flow

import React from "react";
import { withRouter } from "react-router";
import type { MemoryHistory } from "history";

import Box from "components/base/Box";
import Text from "components/base/Text";
import type { Entity } from "data/types";
import ReasonsTable from "components/Table/ReasonsTable";

export type BlockingReasonType = {
  type: string,
  entity: Entity,
  message: string,
};

type Props = {
  error: {
    json: {
      blocking_reasons: BlockingReasonType[],
      message: string,
      name: string,
    },
  },
  onClose: () => void,
  history: MemoryHistory,
};

const BlockingReasons = ({ error, onClose, ...rest }: Props) => {
  const onRowClick = reason => {
    const { history } = rest;
    onClose();
    const orgaName = location.pathname.split("/")[1];
    // TODO handle other kind of entity ?
    if (reason.type === "Account") {
      history.push(`/${orgaName}/admin/accounts/view/${reason.entity.id}`);
    }
  };

  return (
    <Box p={40} flow={20} width={650}>
      <Box>
        <Text header uppercase i18nKey={`reasons:${error.json.name}`} />
        <Text small>{error.json.message}</Text>
      </Box>
      <ReasonsTable
        data={error.json.blocking_reasons}
        onRowClick={onRowClick}
      />
    </Box>
  );
};

export default withRouter(BlockingReasons);
