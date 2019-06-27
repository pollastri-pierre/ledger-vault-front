// @flow

import React, { PureComponent } from "react";
import Box from "components/base/Box";
import { withRouter } from "react-router-dom";
import Text from "components/base/Text";
import type { Group, User } from "data/types";
import colors from "shared/colors";
import ListGroupMembers from "components/ListGroupMembers";
import GroupDetailsDetails from "containers/Admin/Groups/GroupDetailsDetails";
import type { Connection } from "restlay/ConnectionQuery";

type Props = {
  close: Function,
  group: Group,
  operators: Connection<User>,
};

class GroupDetailsOverview extends PureComponent<Props> {
  onSuccess = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { group, operators } = this.props;
    // TODO need an endpoint not paginated for this
    const listOperators = operators.edges.map(e => e.node);
    return (
      <Box>
        <GroupDetailsDetails group={group} />
        <Box pt={20} flow={20} style={styles.borderTop}>
          <Box flow={0} horizontal align="center" justify="space-between">
            <Text bold uppercase small>
              Members
            </Text>
          </Box>
          <ListGroupMembers allUsers={listOperators} users={group.members} />
        </Box>
      </Box>
    );
  }
}

const styles = {
  borderTop: {
    borderTop: `1px solid ${colors.argile}`,
  },
};

export default withRouter(GroupDetailsOverview);
