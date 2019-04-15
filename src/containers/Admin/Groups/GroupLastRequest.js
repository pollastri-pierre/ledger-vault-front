// @flow

import React, { PureComponent } from "react";
import Box from "components/base/Box";
import GroupEditRequest from "containers/Admin/Groups/GroupEditRequest";
import DateFormat from "components/DateFormat";
import { BoxLined } from "components/LineRow";
import Text from "components/base/Text";
import type { Group, User } from "data/types";
import { hasPendingEdit } from "utils/entities";
import type { Connection } from "restlay/ConnectionQuery";

type Props = {
  group: Group,
  operators: Connection<User>,
};

class GroupLastRequest extends PureComponent<Props> {
  render() {
    const { group, operators } = this.props;
    const listOperators = operators.edges.map(e => e.node);

    if (!group.last_request) return null;

    return (
      <Box flow={20}>
        <Box>
          <Row label="Request">{group.last_request.type}</Row>
          <Row label="Expiration date">
            <DateFormat
              date={group.last_request.expiration_date || new Date()}
            />
          </Row>
        </Box>
        {hasPendingEdit(group) && (
          <GroupEditRequest operators={listOperators} group={group} />
        )}
      </Box>
    );
  }
}

export default GroupLastRequest;

const Row = ({
  label,
  children,
}: {
  label: React$Node,
  children: React$Node,
}) => (
  <BoxLined align="center" justify="space-between" flow={10} py={5}>
    <Text small uppercase bold>
      {label}
    </Text>
    {children}
  </BoxLined>
);
