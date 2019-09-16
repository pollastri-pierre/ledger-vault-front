/* eslint-disable react/prop-types */
// @flow

import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import {
  AccountStatusMap,
  MetaStatusMap,
  RequestStatusMap,
  GroupStatusMap,
  UserStatusMap,
  TransactionStatusMap,
} from "data/types";

import Status from "components/Status";
import Box from "components/base/Box";
import Text from "components/base/Text";

import colors from "shared/colors";

function getStatusByEntity(statuses) {
  return (
    <Table>
      <tbody id="statuses-table">
        <tr>
          <TableHead>
            <Trans i18nKey="general:storybook.statusTableHead.gate" />
          </TableHead>
          <TableHead>
            <Trans i18nKey="general:storybook.statusTableHead.translation" />
          </TableHead>
        </tr>
        {Object.keys(statuses).map(status => {
          return (
            <tr>
              <TableData>{status}</TableData>
              <TableData>
                <Status status={status} size="big" />
              </TableData>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

storiesOf("general", module).add("Entity statuses", () => (
  <Box flexWrap="wrap" horizontal justify="space-between">
    <TableComponent
      entity={AccountStatusMap}
      label={<Trans i18nKey="general:storybook.statusTableLabel.account" />}
    />
    <TableComponent
      entity={UserStatusMap}
      label={<Trans i18nKey="general:storybook.statusTableLabel.user" />}
    />
    <TableComponent
      entity={RequestStatusMap}
      label={<Trans i18nKey="general:storybook.statusTableLabel.request" />}
    />
    <TableComponent
      entity={TransactionStatusMap}
      label={<Trans i18nKey="general:storybook.statusTableLabel.transaction" />}
    />
    <TableComponent
      entity={GroupStatusMap}
      label={<Trans i18nKey="general:storybook.statusTableLabel.group" />}
    />
    <TableComponent
      entity={MetaStatusMap}
      label={<Trans i18nKey="general:storybook.statusTableLabel.meta" />}
    />
  </Box>
));

const Table = styled.table`
  border-collapse: collapse;
`;

const TableHead = styled.th`
border: 2px solid ${colors.legacyLightGrey7};
text-align: left;
padding: 8px;
}
`;
const TableData = styled.td`
border: 1px solid ${colors.legacyLightGrey7};
text-align: left;
padding: 8px;
}
`;

type TableComponentProps = {
  entity: Object,
  label: React$Node,
};

function TableComponent(props: TableComponentProps) {
  const { label, entity } = props;
  return (
    <Box flow={10} m={15}>
      <Box align="center">
        <Text uppercase bold color={colors.legacyViolet}>
          {label}
        </Text>
      </Box>
      <Box align="flex-start">{getStatusByEntity(entity)}</Box>
    </Box>
  );
}
