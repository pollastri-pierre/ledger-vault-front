// @flow

import React from "react";
import { MdEdit } from "react-icons/md";

import connectData from "restlay/connectData";
import OrganizationQuery from "api/queries/OrganizationQuery";
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
import type { Organization } from "data/types";

type Props = {
  organization: Organization,
  disabled: boolean,
  displayWarning: boolean,
  onEdit: () => void,
};

const AdminRulesCard = (props: Props) => {
  const { organization, onEdit, disabled, displayWarning } = props;
  return (
    <Card height={300} width={400}>
      <CardTitle noMargin>Admin rules</CardTitle>
      <CardDesc i18nKey="adminDashboard:editAdminRules" />
      <Box flow={20} grow>
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
      </Box>
    </Card>
  );
};

export default connectData(AdminRulesCard, {
  RenderLoading: () => <CardLoading width={400} height={300} />,
  RenderError: CardError,
  queries: {
    organization: OrganizationQuery,
  },
});
