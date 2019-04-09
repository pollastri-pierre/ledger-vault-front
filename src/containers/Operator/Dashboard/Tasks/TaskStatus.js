// @flow

import React, { PureComponent } from "react";
import moment from "moment";
import { FaExclamationCircle } from "react-icons/fa";
import Box from "components/base/Box";
import EntityStatus from "components/EntityStatus";

import colors from "shared/colors";

class TxStatus extends PureComponent<{
  task: *,
}> {
  render() {
    const { task } = this.props;
    const now = moment();
    const futureBreakpoint = moment().add(5, "d");
    const displayExpirationWarning = moment(
      task.expiration_date.toDate(),
    ).isBetween(now.toDate(), futureBreakpoint.toDate());
    const daysLeft = displayExpirationWarning
      ? moment
          .duration(futureBreakpoint.diff(task.expiration_date))
          .asHours()
          .toFixed(2)
      : null;
    return (
      <Box width={450}>
        <Box flow={10} align="center" horizontal>
          <EntityStatus status={task.status} request={task} />
          {displayExpirationWarning && <ExpiresInFormatter hours={daysLeft} />}
        </Box>
      </Box>
    );
  }
}

export default TxStatus;

const styles = {
  expiryBase: {
    borderRadius: 10,
    backgroundColor: colors.translucentGrenade,
  },
  expiry: {
    fontSize: 10,
    color: colors.lead,
    fontStyle: "italic",
  },
};
function ExpiresInFormatter({ hours }: { hours: ?string }) {
  return (
    <Box style={styles.expiryBase} p={3} horizontal>
      <Box align="center" justify="center" px={2}>
        <FaExclamationCircle size={9} color={colors.grenade} />
      </Box>
      <Box align="center" style={styles.expiry} justify="center">
        Expires in ~{hours}h
      </Box>
    </Box>
  );
}
