// @flow

import React from "react";
import moment from "moment";
import styled from "styled-components";
import { FaHourglassHalf } from "react-icons/fa";

import Box from "components/base/Box";
import Text from "components/base/Text";
import Absolute from "components/base/Absolute";
import CircleProgress from "components/base/CircleProgress";
import EntityStatus from "components/EntityStatus";
import RequestTitle from "components/RequestTitle";
import colors from "shared/colors";
import { getCurrentStepProgress } from "utils/request";
import type { Request } from "data/types";

import { List, ListEmpty, ListItem } from "./List";

type Props = {
  emptyState: React$Node,
  requests: Request[],
  onRequestClick: Request => void,
  dataTest?: string,
};

export default function RequestsList(props: Props) {
  const { requests, emptyState, onRequestClick, dataTest } = props;

  if (!requests.length) {
    return <ListEmpty>{emptyState}</ListEmpty>;
  }

  return (
    <List data-test={dataTest}>
      {requests.map((request, i) => (
        <RequestCard
          key={request.id}
          dataTest={i}
          request={request}
          onClick={onRequestClick}
        />
      ))}
    </List>
  );
}

type RequestCardProps = {
  request: Request,
  onClick: Request => void,
  dataTest: number,
};

function RequestCard(props: RequestCardProps) {
  const { request, onClick, dataTest } = props;
  const handleClick = () => onClick(request);
  const progress = getCurrentStepProgress(request);
  return (
    <RequestCardContainer onClick={handleClick} data-test={dataTest}>
      {progress ? (
        <CircleProgress size={50} {...progress} />
      ) : (
        <CircleProgress size={50}>
          <FaHourglassHalf color={colors.lightGrey} />
        </CircleProgress>
      )}
      <Absolute top={5} right={5}>
        <EntityStatus status={request.status} request={request} />
      </Absolute>
      <Box>
        <RequestTitle type={request.type} />
        <Text color={colors.textLight}>
          {"Created by "}
          <strong>{request.created_by.username}</strong>
          {`, ${moment(request.created_on).fromNow()}`}
        </Text>
      </Box>
    </RequestCardContainer>
  );
}

const RequestCardContainer = styled(ListItem)`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 20px;
  }
`;
