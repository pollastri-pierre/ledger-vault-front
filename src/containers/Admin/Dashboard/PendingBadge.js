// @flow
import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import PendingRequestsQuery from "api/queries/PendingRequestsQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import type { Connection } from "restlay/ConnectionQuery";
import type { Request, Member } from "data/types";
import Box from "components/base/Box";
import colors from "shared/colors";

const styles = {
  base: {
    lineHeight: 0,
    width: 18,
    height: 18,
    borderRadius: "50%",
    fontSize: 11
  }
};
type Props = {
  data: Connection<Request>,
  me: Member
};
class PendingBadge extends PureComponent<Props> {
  render() {
    const { data, me } = this.props;
    const requests = data && data.edges.map(el => el.node);
    // NOTE: temp filter the me-related pending requests until gate gives this
    const requestForMe =
      requests &&
      requests.filter(el => {
        const found = el.approvals.find(item => item.created_by.id === me.id);
        return !found;
      });
    if (!requestForMe.length) return null;
    return (
      <Box
        align="center"
        justify="center"
        bg={colors.grenade}
        color={colors.white}
        style={styles.base}
      >
        {requestForMe.length}
      </Box>
    );
  }
}

export default connectData(PendingBadge, {
  queries: {
    data: PendingRequestsQuery,
    me: ProfileQuery
  }
});
