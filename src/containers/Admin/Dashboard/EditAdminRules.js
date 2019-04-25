// @flow

import React, { useState } from "react";
import { MdEdit } from "react-icons/md";

import { createAndApprove } from "device/interactions/approveFlow";
import { CardError } from "components/base/Card";
import { RichModalHeader, CtaContainer } from "components/base/MultiStepsFlow";
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
      <RichModalHeader title="Edit admin rules" Icon={MdEdit} onClose={close} />
      <Box p={20} flow={20} grow>
        <InfoBox type="info">Changing admin rule is very dangerous</InfoBox>
        <ApprovalSlider
          number={quorum}
          total={organization.number_of_admins}
          onChange={setQuorum}
          min={2}
        />
      </Box>
      <CtaContainer>
        <ApproveRequestButton
          interactions={createAndApprove}
          disabled={quorum === organization.quorum}
          additionalFields={{ type: "UPDATE_QUORUM", data: { quorum } }}
          onSuccess={close}
          onError={null}
          buttonLabel="Edit"
        />
      </CtaContainer>
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
