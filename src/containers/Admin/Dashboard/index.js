// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import RequestsQuery from "api/queries/RequestsQuery";
import { MdEdit } from "react-icons/md";
import type { MemoryHistory } from "history";

import RequestsTable from "components/Table/RequestsTable";
import type { Connection } from "restlay/ConnectionQuery";
import Card, {
  CardLoading,
  CardError,
  CardTitle,
  CardDesc,
} from "components/base/Card";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import Button from "components/base/Button";
import type { Request, User, Organization } from "data/types";
import { withMe } from "components/UserContextProvider";
import OrganizationQuery from "api/queries/OrganizationQuery";
import { hasUserApprovedRequest } from "utils/request";

type Props = {
  data: Connection<Request>,
  history: MemoryHistory,
  me: User,
};

class AdminDashboard extends PureComponent<Props> {
  handleRowClick = (request: Request) => {
    if (request.target_type === "GROUP") {
      this.props.history.push(
        `dashboard/groups/details/${request.target_id}/0`,
      );
    } else if (request.target_type === "PERSON") {
      this.props.history.push(`dashboard/users/details/${request.target_id}`);
    } else if (
      request.target_type === "BITCOIN_ACCOUNT" ||
      request.target_type === "ERC20_ACCOUNT" ||
      request.target_type === "ETHEREUM_ACCOUNT"
    ) {
      this.props.history.push(
        `dashboard/accounts/details/${request.target_id}`,
      );
    } else if (
      request.target_type === "BITCOIN_LIKE_TRANSACTION" ||
      request.target_type === "ETHEREUM_LIKE_TRANSACTION"
    ) {
      this.props.history.push(
        `dashboard/transactions/details/${request.target_id}/0`,
      );
    } else if (request.target_type === "ORGANIZATION") {
      this.props.history.push(`dashboard/organization/details/${request.id}`);
    }
  };

  handleOpenAdminRules = () => {
    this.props.history.push(`dashboard/admin-rules`);
  };

  render() {
    const { data, me } = this.props;
    const requests = data.edges.map(el => el.node);
    const myRequests = requests.filter(
      request => !hasUserApprovedRequest(request, me),
    );
    const otherRequests = requests.filter(request =>
      hasUserApprovedRequest(request, me),
    );

    const canUpdateAdminRules = requests.every(r => r.type !== "UPDATE_QUORUM");
    const warningEditAdminRules = requests.length > 0;

    return (
      <Box flow={20}>
        <Box horizontal flow={20} align="flex-start">
          <Card grow>
            <CardTitle noMargin i18nKey="adminDashboard:myRequestsTitle" />
            <CardDesc i18nKey="adminDashboard:myRequestsDesc" />
            <RequestsTable data={myRequests} onRowClick={this.handleRowClick} />
          </Card>
          <AdminRulesCard
            onEdit={this.handleOpenAdminRules}
            disabled={!canUpdateAdminRules}
            displayWarning={warningEditAdminRules}
          />
        </Box>
        <Card>
          <CardTitle noMargin i18nKey="adminDashboard:otherRequestsTitle" />
          <CardDesc i18nKey="adminDashboard:otherRequestsDesc" />
          <RequestsTable
            data={otherRequests}
            onRowClick={this.handleRowClick}
          />
        </Card>
      </Box>
    );
  }
}

type AdminRulesCardProps = {
  organization: Organization,
  disabled: boolean,
  displayWarning: boolean,
  onEdit: () => void,
};

const AdminRulesCard = connectData(
  (props: AdminRulesCardProps) => {
    const { organization, onEdit, disabled, displayWarning } = props;
    return (
      <Card height={300} width={400} flow={20}>
        <CardTitle>Admin rules</CardTitle>
        <Box grow align="center" justify="center">
          <Text large>
            {organization.quorum} approvals out of{" "}
            {organization.number_of_admins} admins
          </Text>
        </Box>
        {displayWarning && (
          <InfoBox type="warning">
            <Text i18nKey="adminDashboard:warningEditAdminRules" />
          </InfoBox>
        )}
        <Button
          variant="filled"
          type="submit"
          IconLeft={MdEdit}
          onClick={onEdit}
          disabled={disabled}
        >
          Edit admin rules
        </Button>
      </Card>
    );
  },
  {
    RenderLoading: () => <CardLoading width={400} height={300} />,
    RenderError: CardError,
    queries: {
      organization: OrganizationQuery,
    },
  },
);

export default connectData(withMe(AdminDashboard), {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {
    data: RequestsQuery,
  },
  propsToQueryParams: () => ({
    status: "PENDING_APPROVAL",
    pageSize: -1,
  }),
});
