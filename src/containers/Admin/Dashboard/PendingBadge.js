// @flow
import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import PendingRequestsQuery from "api/queries/PendingRequestsQuery";
import type { Connection } from "restlay/ConnectionQuery";
import type { Request, User } from "data/types";
import Box from "components/base/Box";
import { withMe } from "components/UserContextProvider";
import { hasUserApprovedRequest } from "utils/request";
import colors from "shared/colors";

const styles = {
  base: {
    lineHeight: 0,
    width: 18,
    height: 18,
    borderRadius: "50%",
    fontSize: 11,
  },
};
type Props = {
  data: Connection<Request>,
  me: User,
};
class PendingBadge extends PureComponent<Props> {
  render() {
    const { data, me } = this.props;
    const requests = data && data.edges.map(el => el.node);
    // NOTE: temp filter the me-related pending requests until gate gives this
    const myRequests = requests.filter(
      request => !hasUserApprovedRequest(request, me),
    );
    if (!myRequests.length) return null;
    return (
      <Box
        align="center"
        justify="center"
        bg={colors.grenade}
        color={colors.white}
        style={styles.base}
      >
        {myRequests.length}
      </Box>
    );
  }
}

export default connectData(withMe(PendingBadge), {
  queries: {
    data: PendingRequestsQuery,
  },
});
