// @flow

import React, { PureComponent, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import {
  FaCheck,
  FaPlus,
  FaAngleDown,
  FaAngleUp,
  FaEnvelopeOpen,
} from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";

import connectData from "restlay/connectData";
import type { Approval, Organization } from "data/types";
import OrganizationQuery from "api/queries/OrganizationQuery";
import colors from "shared/colors";
import Status from "components/Status";
import Box from "components/base/Box";
import Text from "components/base/Text";
import IconClose from "components/icons/Close";

type Item = {
  type: "CREATE" | "APPROVE" | "ABORT" | "EDIT" | "REVOKE" | "INVITE",
  label: React$Node,
  date: string | Date,
};

type Props = {
  organization: Organization,
  // TODO flowtype this...
  history: Array<any>,
};

const iconsByType = {
  CREATE: <FaPlus color={colors.ocean} />,
  REVOKE: <MdDelete color={colors.grenade} />,
  INVITE: <FaEnvelopeOpen color={colors.lightGrey} />,
  EDIT: <MdEdit color={colors.ocean} />,
  APPROVE: <FaCheck color={colors.green} />,
  ABORT: <IconClose size={16} color={colors.grenade} />,
};

const ACTIONSCREATEUSER = ["CREATE_OPERATOR", "CREATE_ADMIN"];

const HistoryItem = ({ item }: { item: Item }) => (
  <Box pl={40} position="relative">
    <Ball>{iconsByType[item.type]}</Ball>
    <Box horizontal flow={5} color={colors.shark}>
      {item.label}
    </Box>
    <Text small color={colors.mediumGrey}>
      {moment(item.date).format("LLL")}
    </Text>
  </Box>
);

const CollapseIcon = ({ collapsed }: { collapsed: boolean }) =>
  collapsed ? <FaAngleDown size={12} /> : <FaAngleUp size={12} />;

const RequestHistory = ({
  history,
  quorum,
  collapsed,
  finalStatus,
}: {
  history: Array<any>,
  quorum?: number,
  collapsed?: boolean,
  finalStatus: "APPROVED" | "PENDING",
}) => {
  const [isCollapsed, setCollapsed] = useState(!!collapsed);
  const onCollapse = () => setCollapsed(!isCollapsed);

  const r = [...history].reverse();
  const fullHistory = resolveFullHistory(r, quorum || 0);
  const request = fullHistory[fullHistory.length - 1];
  const last = fullHistory[0];
  return (
    <RequestContainer
      isPending={finalStatus === "PENDING"}
      onClick={onCollapse}
      canBeCollapsed={fullHistory.length > 1}
    >
      <Bar />
      <Box horizontal justify="space-between" align="flex-start">
        <Box flow={20}>
          {isCollapsed ? (
            <Box
              horizontal
              justify="space-between"
              align="flex-start"
              flow={20}
            >
              <HistoryItem item={request} />
            </Box>
          ) : (
            fullHistory
              .reverse()
              .map(item => (
                <HistoryItem key={item.date.toString()} item={item} />
              ))
          )}
        </Box>
        <CollapseIconContainer>
          <Status
            status={(last.type === "ABORT" && "ABORTED") || finalStatus}
          />
          <CollapseIcon collapsed={isCollapsed} />
        </CollapseIconContainer>
      </Box>
    </RequestContainer>
  );
};
class EntityHistory extends PureComponent<Props> {
  render() {
    const { history, organization } = this.props;
    const groupedHistory = groupHistoryByRequest(history);

    if (groupedHistory.length === 0) {
      return <Text>No history for this entity</Text>;
    }
    return (
      <Box flow={20}>
        {groupedHistory.map((request, i) => {
          const approvalsItem = request.find(r => !!r.approvals);
          const nbApproval = approvalsItem && approvalsItem.approvals.length;
          // request[0].approvals && request[0].approvals.length;
          const finalStatus =
            nbApproval === organization.quorum ? "APPROVED" : "PENDING";
          return (
            <RequestHistory
              history={request}
              quorum={organization.quorum}
              finalStatus={finalStatus}
              collapsed={finalStatus !== "PENDING"}
              key={i} // eslint-disable-line react/no-array-index-key
            />
          );
        })}
      </Box>
    );
  }
}

const Bar = styled.div`
  position: absolute;
  top: 10px;
  left: 24px;
  bottom: 40px;
  width: 2px;
  background: #eee;
`;

const CollapseIconContainer = styled(Box).attrs({ horizontal: true, flow: 10 })`
  color: grey;
`;

const RequestContainer = styled(Box).attrs({
  position: "relative",
  p: 10,
})`
  background: #fafafa;
  border-radius: 4px;
  cursor: ${p => (p.canBeCollapsed ? "pointer" : "default")};
  border: ${p => (p.isPending ? "2px solid #27d0e2" : "none")};

  & ${CollapseIconContainer} svg {
    opacity: ${p => (p.canBeCollapsed ? 1 : 0)};
  }

  &:hover ${CollapseIconContainer} {
    color: black;
  }
`;

const Ball = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function sumApprovals(approvals: Approval[], index: number) {
  let nb = 0;
  for (let i = approvals.length - 1; i >= 0 && i >= index; i--) {
    const app = approvals[i];
    if (app.type === "ABORT") break;
    nb++;
  }
  return nb;
}

function groupHistoryByRequest(history: Array<any>) {
  const grouped = [];
  let requests = [];
  for (let i = 0; i < history.length; i++) {
    requests.push(history[i]);
    if (history[i].status === "APPROVED" || history[i].status === "ABORTED") {
      grouped.push(requests);
      requests = [];
    }
    if (i === history.length - 1 && requests.length > 0) {
      grouped.push(requests);
    }
  }

  return grouped;
}

function resolveFullHistory(history: Array<any>, quorum: number) {
  // unwrap the approvals
  const fullHistory: Item[] = history.reduce((acc, cur) => {
    if (cur.status === "PENDING_APPROVAL") {
      cur.approvals.forEach((approval, i) => {
        const n = sumApprovals(cur.approvals, i);
        acc.push({
          type: approval.type === "APPROVE" ? "APPROVE" : "ABORT",
          date: approval.created_on,
          label: (
            <>
              <b>
                {approval.type === "APPROVE"
                  ? `approved (${n}/${quorum})`
                  : "rejected"}
                {" by"}
              </b>
              <span>{approval.created_by.username}</span>
            </>
          ),
        });
      });
    }
    if (cur.type.startsWith("REVOKE_") && cur.status === "PENDING_APPROVAL") {
      acc.push({
        type: "REVOKE",
        date: cur.created_on,
        label: (
          <>
            <b>deleted by</b>
            <span>{cur.created_by.username}</span>
          </>
        ),
      });
    }
    if (cur.type.startsWith("EDIT_") && cur.status === "PENDING_APPROVAL") {
      acc.push({
        type: "EDIT",
        date: cur.created_on,
        label: (
          <>
            <b>edited by</b>
            <span>{cur.created_by.username}</span>
          </>
        ),
      });
    }
    if (
      cur.type.startsWith("CREATE_") &&
      cur.status === "PENDING_REGISTRATION"
    ) {
      acc.push({
        type: "INVITE",
        date: cur.created_on,
        label: (
          <>
            <b>invited by</b>
            <span>{cur.created_by.username}</span>
          </>
        ),
      });
    }
    if (
      ACTIONSCREATEUSER.indexOf(cur.type) > -1 &&
      cur.status === "PENDING_APPROVAL"
    ) {
      acc.push({
        type: "CREATE",
        date: cur.created_on,
        label: (
          <>
            <b>Registered on the platform</b>
          </>
        ),
      });
    } else if (
      cur.type.startsWith("CREATE_") &&
      cur.status === "PENDING_APPROVAL"
    ) {
      acc.push({
        type: "CREATE",
        date: cur.created_on,
        label: (
          <>
            <b>created by</b>
            <span>{cur.created_by.username}</span>
          </>
        ),
      });
    }
    return acc;
  }, []);
  return fullHistory;
}

export default connectData(EntityHistory, {
  queries: {
    organization: OrganizationQuery,
  },
});
