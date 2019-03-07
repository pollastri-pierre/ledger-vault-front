// @flow
import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import DateFormat from "components/DateFormat";
import LineRow from "components/LineRow";
import Box from "components/base/Box";

import type { Request, GateError } from "data/types";

import colors from "shared/colors";

type Props = {
  request: Request,
  error: ?GateError
};

class PendingRequestsOverview extends PureComponent<Props> {
  render() {
    const { request, error } = this.props;
    const workspace = window.location.pathname.split("/")[1];
    // TODO: as a separate task refactor using the idea of InfoList for different category
    return (
      <Box>
        {request.user ? (
          <Fragment>
            <LineRow label={<Trans i18nKey="memberDetails:username" />}>
              {request.user.username}
            </LineRow>
            <LineRow label={<Trans i18nKey="memberDetails:role" />}>
              {request.type}
            </LineRow>
            <LineRow label="Workspace">{workspace}</LineRow>
            <LineRow label="Created">
              <DateFormat>{request.created_on}</DateFormat>
            </LineRow>
            <LineRow label="Expires">COMING..</LineRow>
          </Fragment>
        ) : (
          <Box>Another entity, not user</Box>
        )}
        {error && (
          <Box align="center" justify="center" color={colors.grenade}>
            error.json.message
          </Box>
        )}
      </Box>
    );
  }
}

export default PendingRequestsOverview;
