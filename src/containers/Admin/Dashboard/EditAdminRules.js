// @flow

import React, { useState } from "react";
import { MdEdit } from "react-icons/md";

import { createAndApprove } from "device/interactions/hsmFlows";
import { CardError } from "components/base/Card";
import { RichModalHeader, RichModalFooter } from "components/base/Modal";
import ApproveRequestButton from "components/ApproveRequestButton";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import connectData from "restlay/connectData";
import OrganizationQuery from "api/queries/OrganizationQuery";
import ApprovalSlider from "containers/Onboarding/ApprovalSlider";
import type { Organization } from "data/types";

type Props = {
  organization: Organization,
  close: () => void,
};

function EditAdminRules(props: Props) {
  const { organization, close } = props;
  const [quorum, setQuorum] = useState(organization.quorum || 0);
  const inner = (
    <Box width={500} height={500}>
      <RichModalHeader title="Edit admin rule" Icon={MdEdit} onClose={close} />
      <Box p={20} flow={20} grow>
        <InfoBox type="info">
          Editing the admin will affect all pending requests.
        </InfoBox>
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
            onSuccess={close}
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
    organization: OrganizationQuery,
  },
});
