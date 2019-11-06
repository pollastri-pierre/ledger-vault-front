// @flow

import React from "react";
import { Trans } from "react-i18next";
import moment from "moment";
import styled from "styled-components";
import { FaHourglassHalf } from "react-icons/fa";
import { MdCreateNewFolder } from "react-icons/md";

import AccountQuery from "api/queries/AccountQuery";
import connectData from "restlay/connectData";
import AccountName from "components/AccountName";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Absolute from "components/base/Absolute";
import CircleProgress from "components/base/CircleProgress";
import EntityStatus from "components/EntityStatus";
import RequestTitle from "components/RequestTitle";
import colors from "shared/colors";
import { getCurrentStepProgress } from "utils/request";
import type { GenericRequest, Account } from "data/types";

import { List, ListEmpty, ListItem } from "./List";

type Props = {
  emptyState: React$Node,
  requests: GenericRequest[],
  onRequestClick: GenericRequest => void,
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
  request: GenericRequest,
  onClick: GenericRequest => void,
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
        {request.type === "CREATE_TRANSACTION" ? (
          <TransactionCreationRequestTitle request={request} />
        ) : (
          <RequestTitle request={request} />
        )}
        {request.created_by && (
          <Text color={colors.textLight}>
            {"Created by "}
            <strong>{request.created_by.username}</strong>
            {`, ${moment(request.created_on).fromNow()}`}
          </Text>
        )}
      </Box>
    </RequestCardContainer>
  );
}

export function TransactionCreationRequestTitle({
  request,
}: {
  request: GenericRequest,
}) {
  const { transaction } = request;
  if (!transaction) return null;
  return (
    <Box horizontal align="center" flow={5}>
      <MdCreateNewFolder size={16} color={colors.lightGrey} />
      <Box horizontal align="center" flow={5} flexWrap="wrap">
        <span>
          <Trans i18nKey="request:richType.CREATE_TRANSACTION" />
        </span>
        <LazyLoadAccountName accountID={transaction.account_id} />
      </Box>
    </Box>
  );
}

const LazyLoadAccountName = connectData(
  ({ account }: { account: Account }) => (
    <Box horizontal align="center" flow={5}>
      <Trans
        i18nKey="request:extra.CREATE_TRANSACTION_ON"
        components={[
          <span />,
          <strong>
            <AccountName space={5} account={account} />
          </strong>,
          <span />,
        ]}
      />
    </Box>
  ),
  {
    queries: {
      account: AccountQuery,
    },
    propsToQueryParams: ({ accountID }) => ({ accountId: accountID }),
    RenderLoading: () => <span style={{ color: colors.mediumGrey }}>...</span>,
  },
);

const RequestCardContainer = styled(ListItem)`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 20px;
  }
`;
