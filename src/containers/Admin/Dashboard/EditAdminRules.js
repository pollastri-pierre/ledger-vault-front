// @flow

import React, { useState } from "react";
import { MdEdit } from "react-icons/md";

import connectData from "restlay/connectData";
import RequestsQuery from "api/queries/RequestsQuery";
import { createAndApprove } from "device/interactions/hsmFlows";
import Text from "components/base/Text";
import { RichModalHeader, RichModalFooter } from "components/base/Modal";
import ApproveRequestButton from "components/ApproveRequestButton";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import { useOrganization } from "components/OrganizationContext";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import { CardError } from "components/base/Card";
import type { Connection } from "restlay/ConnectionQuery";
import type { Request } from "data/types";
import ApprovalSlider from "containers/Onboarding/ApprovalSlider";

type Props = {
  close: () => void,
  requestsConnection: Connection<Request>,
};

function EditAdminRules(props: Props) {
  const { close, requestsConnection } = props;
  const requests = requestsConnection.edges.map(e => e.node);
  const { organization } = useOrganization();
  const [quorum, setQuorum] = useState(organization.quorum || 0);
  const { refresh } = useOrganization();

  const onSuccess = () => {
    refresh();
    close();
  };

  const inner = (
    <Box width={500} height={500}>
      <RichModalHeader title="Edit admin rule" Icon={MdEdit} onClose={close} />
      <Box p={20} flow={20} grow>
        {!!requests.length && (
          <InfoBox type="warning">
            <Text i18nKey="adminDashboard:warningEditAdminRules" />
          </InfoBox>
        )}
        <ApprovalSlider
          number={quorum}
          total={organization.number_of_admins}
          onChange={setQuorum}
          max={organization.number_of_admins - 1}
          min={2}
        />
      </Box>
      <RichModalFooter>
        <Box align="flex-end" grow={1}>
          <ApproveRequestButton
            interactions={createAndApprove("ORGANIZATION")}
            disabled={quorum === organization.quorum}
            additionalFields={{ type: "UPDATE_QUORUM", data: { quorum } }}
            onSuccess={onSuccess}
            buttonLabel="Edit"
          />
        </Box>
      </RichModalFooter>
    </Box>
  );

  return <GrowingCard>{inner}</GrowingCard>;
}

export default connectData(EditAdminRules, {
  RenderLoading: GrowingSpinner,
  RenderError: CardError,
  queries: {
    requestsConnection: RequestsQuery,
  },
  propsToQueryParams: () => ({
    status: ["PENDING_APPROVAL", "PENDING_REGISTRATION"],
    pageSize: -1,
  }),
});
