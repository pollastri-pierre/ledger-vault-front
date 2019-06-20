// @flow

/* eslint-disable react/no-array-index-key */

import React, { useState } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import moment from "moment";
import {
  FaPlus,
  FaAngleDown,
  FaAngleUp,
  FaEnvelopeOpen,
  FaRocket,
  FaUserPlus,
  FaCheck,
} from "react-icons/fa";
import { MdEdit, MdDelete, MdClear, MdCheck } from "react-icons/md";

import type {
  VaultHistoryApproval,
  VaultHistoryApprovalStep,
  VaultHistoryStep,
  VaultHistoryItem,
  VaultHistory,
} from "utils/history";
import { deserializeHistory } from "utils/history";
import colors from "shared/colors";
import Status from "components/Status";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Fetch from "components/Fetch";

type EntityType = "user" | "group" | "account" | "transaction";

type Props = {
  history: VaultHistory,
  entityType: EntityType,
};

const itemIconsByType = {
  CREATE: <FaPlus color={colors.text} />,
  EDIT: <MdEdit color={colors.text} />,
  DELETE: <MdDelete color={colors.text} />,
};

const stepIconsByType = {
  CREATED: <FaPlus color={colors.ocean} />,
  APPROVED: <FaCheck color={colors.ocean} />,
  ABORTED: <MdClear color={colors.grenade} />,
  REVOKED: <MdClear color={colors.grenade} />,
  EDITED: <MdEdit color={colors.ocean} />,
  REGISTERED: <FaUserPlus color={colors.ocean} />,
  SUBMITTED: <FaRocket color={colors.ocean} />,
  INVITED: <FaEnvelopeOpen color={colors.ocean} />,
};

const CollapseIcon = ({ collapsed }: { collapsed: boolean }) =>
  collapsed ? <FaAngleDown size={12} /> : <FaAngleUp size={12} />;

const ApprovalIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${p => (p.abort ? colors.grenade : colors.ocean)};
  color: white;
`;

const approvalIcons = {
  APPROVE: (
    <ApprovalIcon>
      <MdCheck />
    </ApprovalIcon>
  ),
  ABORT: (
    <ApprovalIcon abort>
      <MdClear />
    </ApprovalIcon>
  ),
};

function EntityHistory(props: Props) {
  const { history, entityType } = props;

  if (!history || !history.length) {
    return <Text>No history for this entity</Text>;
  }

  return (
    <Box flow={10} style={{ maxWidth: 600 }}>
      {history.map((item, i) => (
        <HistoryItem key={i} entityType={entityType} item={item} />
      ))}
    </Box>
  );
}

const HistoryItem = ({
  item,
  entityType,
}: {
  item: VaultHistoryItem,
  entityType: EntityType,
}) => {
  const status = getItemStatus(item);
  const [isCollapsed, setCollapsed] = useState(status !== "PENDING");
  const onToggle = () => setCollapsed(!isCollapsed);
  return (
    <HistoryItemContainer>
      <HistoryItemHeader
        isCollapsed={isCollapsed}
        onToggle={onToggle}
        status={status}
      >
        <Box horizontal align="center" flow={10}>
          {itemIconsByType[item.type]}
          <span>
            <Trans i18nKey={`history:title.${item.type}.${entityType}`} />
          </span>
        </Box>
      </HistoryItemHeader>
      {!isCollapsed && (
        <HistoryItemBody>
          {item.steps.map((step, i) => (
            <HistoryStep
              key={i}
              isLast={i === item.steps.length - 1}
              step={step}
            />
          ))}
        </HistoryItemBody>
      )}
    </HistoryItemContainer>
  );
};

const HistoryItemHeader = ({
  children,
  isCollapsed,
  onToggle,
  status,
}: {
  children: React$Node,
  isCollapsed: boolean,
  onToggle: () => void,
  status: ?string,
}) => (
  <HistoryItemHeaderContainer onClick={onToggle}>
    {children}
    <Box horizontal align="center" flow={10}>
      {status && <Status status={status} />}
      <CollapseIcon collapsed={isCollapsed} />
    </Box>
  </HistoryItemHeaderContainer>
);

const HistoryItemHeaderContainer = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  & svg {
    color: ${colors.textLight};
  }

  &:hover svg {
    color: ${colors.text};
  }
`;

const HistoryStep = ({
  step,
  isLast,
}: {
  step: VaultHistoryStep,
  isLast: boolean,
}) => (
  <HistoryStepContainer isLast={isLast}>
    <Ball>{stepIconsByType[step.type]}</Ball>
    <span>
      <Trans i18nKey={`history:stepType.${step.type}`} />
      {" on "}
      {moment(step.createdOn).format("LLL")}
    </span>
    {step.approvalsSteps && (
      <ApprovalsSteps approvalsSteps={step.approvalsSteps} />
    )}
  </HistoryStepContainer>
);

const ApprovalsSteps = ({
  approvalsSteps,
}: {
  approvalsSteps: Array<?VaultHistoryApprovalStep>,
}) => (
  <ApprovalsStepsContainer>
    {approvalsSteps.map((approvalsStep, i) => (
      <ApprovalsStep key={i} approvalsStep={approvalsStep} />
    ))}
  </ApprovalsStepsContainer>
);

const ApprovalsStepsContainer = styled(Box).attrs({ flow: 10 })`
  margin-top: 10px;
`;

const ApprovalsStep = ({
  approvalsStep,
}: {
  approvalsStep: ?VaultHistoryApprovalStep,
}) =>
  approvalsStep ? (
    <ApprovalStepContainer>
      {approvalsStep.approvals.map((approval, i) => (
        <Approval
          key={i}
          approval={approval}
          index={i}
          quorum={approvalsStep.quorum || 0}
        />
      ))}
    </ApprovalStepContainer>
  ) : (
    <ApprovalStepContainer>Anonymized</ApprovalStepContainer>
  );

const ApprovalStepContainer = styled(Box).attrs({ flow: 10 })`
  position: relative;
  background: rgba(0, 0, 0, 0.05);
  padding: 10px;
  border-radius: 4px;
  border: 1px solid ${colors.form.border};
`;

const approvalLabelComponents = <b>0</b>;

const Approval = ({
  approval,
  index,
  quorum,
}: {
  approval: VaultHistoryApproval,
  index: number,
  quorum: number,
}) => {
  const values = {
    name: approval.createdBy.username,
    date: moment(approval.createdOn).format("LLL"),
    quorum: `(${index + 1}/${quorum})`,
  };
  const i18nKey =
    approval.type === "APPROVE" ? "history:approveLabel" : "history:abortLabel";
  return (
    <Box horizontal flow={10}>
      {approvalIcons[approval.type]}
      <span>
        <Trans
          i18nKey={i18nKey}
          components={approvalLabelComponents}
          values={values}
        />
      </span>
    </Box>
  );
};

const HistoryStepContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &:after {
    content: "";
    width: 2px;
    position: absolute;
    left: -30px;
    top: 0px;
    bottom: -20px;
    background: ${p => (p.isLast ? "transparent" : colors.form.border)};
  }
`;

const HistoryItemContainer = styled.div`
  border: 1px solid ${colors.form.border};
  border-radius: 4px;
`;

const HistoryItemBody = styled(Box).attrs({
  position: "relative",
  p: 20,
  flow: 20,
})`
  cursor: ${p => (p.canBeCollapsed ? "pointer" : "default")};
  border-color: ${p => (p.isPending ? colors.ocean : "")};
  background: ${colors.form.bg};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  padding-left: 60px;
`;

const Ball = styled.div`
  position: absolute;
  top: -5px;
  left: -43px;
  z-index: 1;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid ${colors.form.border};
  display: flex;
  align-items: center;
  justify-content: center;
`;

function getItemStatus(item: VaultHistoryItem) {
  const lastStep = item.steps[item.steps.length - 1];
  if (!lastStep) return null;
  if (lastStep.type === "APPROVED" || lastStep.type === "SUBMITTED") {
    return "APPROVED";
  }
  if (lastStep.type === "ABORTED") {
    return "ABORTED";
  }
  return "PENDING";
}

export function FetchEntityHistory({
  url,
  entityType,
}: {
  url: string,
  entityType: "user" | "group" | "account" | "transaction",
}) {
  return (
    <Fetch url={url} deserialize={deserializeHistory}>
      {history => <EntityHistory history={history} entityType={entityType} />}
    </Fetch>
  );
}

export default EntityHistory;
