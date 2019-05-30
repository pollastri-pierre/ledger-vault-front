// @flow
import React, { PureComponent } from "react";
import styled from "styled-components";
import connectData from "restlay/connectData";
import RequestsQuery from "api/queries/RequestsQuery";
import type { Connection } from "restlay/ConnectionQuery";
import type { Request, User } from "data/types";
import { withMe } from "components/UserContextProvider";
import { hasUserApprovedRequest } from "utils/request";
import colors from "shared/colors";

type Props = {
  data: Connection<Request>,
  me: User,
};

class PendingBadge extends PureComponent<Props> {
  render() {
    const { data, me } = this.props;
    const requests =
      data &&
      data.edges
        .map(el => el.node)
        .filter(r => r.status !== "PENDING_REGISTRATION");
    // NOTE: temp filter the me-related pending requests until gate gives this
    const myRequests = requests.filter(
      request => !hasUserApprovedRequest(request, me),
    );
    if (!myRequests.length) return null;
    return <NotifComponent>{myRequests.length}</NotifComponent>;
  }
}

export default connectData(withMe(PendingBadge), {
  queries: {
    data: RequestsQuery,
  },
  propsToQueryParams: () => ({
    status: ["PENDING_APPROVAL", "PENDING_REGISTRATION"],
    pageSize: -1,
  }),
});

export const Badge = styled.div`
  border-radius: 10px;
  padding-left: 5px;
  padding-right: 5px;
  height: 18px;
  min-width: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  text-shadow: rgba(0, 0, 0, 0.1) 0 1px 0;
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 1px;
  color: white;
  font-weight: bold !important;
  font-size: 10px !important;
  background: ${colors.grenade};
`;

export const NotifComponent = styled(Badge)`
  position: absolute;
`;
