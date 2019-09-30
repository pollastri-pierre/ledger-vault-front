// @flow

import React from "react";
import { Trans } from "react-i18next";
import type { MemoryHistory } from "history";
import type { Location } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

import RequestsQuery from "api/queries/RequestsQuery";
import type { Connection } from "restlay/ConnectionQuery";
import colors from "shared/colors";
import type { Request } from "data/types";
import { useOrganization } from "components/OrganizationContext";
import CircleProgress from "components/base/CircleProgress";
import Card from "components/base/Card";
import Button from "components/legacy/Button";
import Absolute from "components/base/Absolute";
import Text from "components/base/Text";
import Widget, { connectWidget } from "./Widget";

type Props = {
  history: MemoryHistory,
  location: Location,
  requestsConnection: Connection<Request>,
};

function QuorumWidget(props: Props) {
  const { location, history, requestsConnection } = props;
  const requests = requestsConnection.edges.map(e => e.node);
  const { organization } = useOrganization();
  const org = organization;
  const quorum = org.quorum || 0;
  const onEdit = () => {
    history.push(`${location.pathname}/admin-rules`);
  };
  const updateQuorumRequest = findOne(requests, "UPDATE_QUORUM");
  const addAdminRequest = findOne(requests, "CREATE_ADMIN");
  const revokeAdminRequest = getRevokeAdminReq(requests);
  const canEdit =
    !updateQuorumRequest && !revokeAdminRequest && !addAdminRequest;
  let editBtn = (
    <Absolute top={10} right={10}>
      <Button
        disabled={!canEdit}
        customColor={colors.text}
        variant="filled"
        size="tiny"
        onClick={onEdit}
        data-test="edit-admin-rule"
      >
        Edit admin rule
      </Button>
    </Absolute>
  );
  if (!canEdit) {
    editBtn = (
      <Tooltip
        title={
          <Trans
            i18nKey={
              addAdminRequest
                ? "adminDashboard:cantEditAdminRules_createAdmin"
                : revokeAdminRequest
                ? "adminDashboard:cantEditAdminRules_revokeAdmin"
                : "adminDashboard:cantEditAdminRules_alreadyEdit"
            }
          />
        }
      >
        {editBtn}
      </Tooltip>
    );
  }
  return (
    <Widget title="Admin rule" height={300}>
      <Card grow align="center" justify="center">
        {editBtn}
        <CircleProgress size={150} nb={org.quorum} total={org.number_of_admins}>
          <Text header>
            <strong>{quorum}</strong>
            {` out of `}
            <strong>{org.number_of_admins}</strong>
          </Text>
          <Text>administrators</Text>
        </CircleProgress>
      </Card>
    </Widget>
  );
}

const findOne = (requests, type) => requests.find(r => r.type === type);

const getRevokeAdminReq = requests => {
  const req = findOne(requests, "REVOKE_USER");
  if (!req) return null;
  return !!req.user && req.user.role === "ADMIN";
};

export default connectWidget(QuorumWidget, {
  height: 300,
  queries: {
    requestsConnection: RequestsQuery,
  },
  propsToQueryParams: () => ({
    status: ["PENDING_APPROVAL", "PENDING_REGISTRATION"],
    pageSize: -1,
    order: "asc",
  }),
});
