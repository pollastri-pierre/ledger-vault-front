// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import moment from "moment";
import { FaCheck, FaPlus } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";

import connectData from "restlay/connectData";
import type { Approval, Organization } from "data/types";
import OrganizationQuery from "api/queries/OrganizationQuery";
import colors from "shared/colors";
import Box from "components/base/Box";
import Text from "components/base/Text";
import IconClose from "components/icons/Close";

type Item = {
  type: "CREATE" | "APPROVE" | "ABORT" | "EDIT" | "REVOKE",
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
  EDIT: <MdEdit color={colors.ocean} />,
  APPROVE: <FaCheck color={colors.green} />,
  ABORT: <IconClose size={16} color={colors.grenade} />,
};

const HistoryItem = ({ item }: { item: Item }) => (
  <Box pl={40} position="relative" style={{ height: 50 }}>
    <Ball>{iconsByType[item.type]}</Ball>
    <Box horizontal flow={5} color={colors.shark}>
      {item.label}
    </Box>
    <Text small color={colors.mediumGrey}>
      {moment(item.date).format("LLL")}
    </Text>
  </Box>
);

class EntityHistory extends PureComponent<Props> {
  render() {
    const { history, organization } = this.props;
    const fullHistory = resolveFullHistory(history, organization.quorum || 0);
    return (
      <Box position="relative">
        {fullHistory.length ? (
          <>
            <Bar />
            <Box flow={20}>
              {fullHistory.map(item => (
                <HistoryItem key={item.date.toString()} item={item} />
              ))}
            </Box>
          </>
        ) : (
          "No history for this entity"
        )}
      </Box>
    );
  }
}

const Bar = styled.div`
  position: absolute;
  top: 10px;
  left: 14px;
  bottom: 40px;
  width: 2px;
  background: #eee;
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

function resolveFullHistory(history: Array<any>, quorum: number) {
  // TODO should be in correct order from the gate
  const reversedHistory = [...history].reverse();

  // unwrap the approvals
  const fullHistory: Item[] = reversedHistory.reduce((acc, cur) => {
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
                  : "aborted"}
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
      (cur.status === "PENDING_REGISTRATION" ||
        cur.status === "PENDING_APPROVAL")
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
