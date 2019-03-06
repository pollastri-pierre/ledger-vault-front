// @flow
import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import PendingRequestsQuery from "api/queries/PendingRequestsQuery";
import type { Connection } from "restlay/ConnectionQuery";
import type { Request } from "data/types";
import Box from "components/base/Box";
import colors from "shared/colors";

const styles = {
  base: {
    lineHeight: 0,
    width: 18,
    height: 18,
    borderRadius: "1em",
    fontSize: 11
  }
};
type Props = {
  data: Connection<Request>
};
// temp add me query to filter the me-related pending requests
class PendingBadge extends PureComponent<Props> {
  render() {
    const { data } = this.props;
    const requests = data && data.edges.map(el => el.node);
    if (!requests.length) return null;
    return (
      <Box
        align="center"
        justify="center"
        bg={colors.grenade}
        color={colors.white}
        style={styles.base}
      >
        {requests.length}
      </Box>
    );
  }
}

export default connectData(PendingBadge, {
  queries: {
    data: PendingRequestsQuery
  }
});
