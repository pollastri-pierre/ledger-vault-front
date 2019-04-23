// @flow

import React, { useState } from "react";
import { MdEdit } from "react-icons/md";

import { createAndApprove } from "device/interactions/approveFlow";
import { CardError } from "components/base/Card";
import { RichModalHeader, CtaContainer } from "components/base/MultiStepsFlow";
import ApproveRequestButton from "components/ApproveRequestButton";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import ModalLoading from "components/ModalLoading";
import connectData from "restlay/connectData";
import NumberChooser from "components/base/NumberChooser";
import OrganizationQuery from "api/queries/OrganizationQuery";
import type { Organization } from "data/types";

type Props = {
  organization: Organization,
  close: () => void,
};

function EditAdminRules(props: Props) {
  const { organization, close } = props;
  const [quorum, setQuorum] = useState(organization.quorum || 0);
  return (
    <Box width={500} height={500}>
      <RichModalHeader title="Edit admin rules" Icon={MdEdit} />
      <Box p={20} flow={20} grow>
        <InfoBox type="info">Changing admin rule is very dangerous</InfoBox>
        <NumberChooser
          value={quorum}
          onChange={setQuorum}
          // TODO organization admin #
          max={3}
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
}

export default connectData(EditAdminRules, {
  RenderLoading: () => <ModalLoading height={100} width={100} />,
  RenderError: CardError,
  queries: {
    organization: OrganizationQuery,
  },
});
