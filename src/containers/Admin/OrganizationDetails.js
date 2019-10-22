// @flow

import React from "react";
import invariant from "invariant";
import { MdEdit } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";

import colors from "shared/colors";
import RequestQuery from "api/queries/RequestQuery";
import connectData from "restlay/connectData";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import Status from "components/Status";
import { RichModalHeader, RichModalFooter } from "components/base/Modal";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { useOrganization } from "components/OrganizationContext";
import RequestActionButtons from "components/RequestActionButtons";
import type { Request } from "data/types";

const arrowRight = <FaArrowRight size={9} color={colors.ocean} />;

function OrganizationDetails({
  request,
  close,
}: {
  request: Request,
  close: () => void,
}) {
  const { refresh } = useOrganization();
  invariant(request.organization, "No organization found!");

  const inner = (
    <Box width={500}>
      <RichModalHeader
        title="Edit admin rule request"
        Icon={MdEdit}
        onClose={close}
      />
      <Box py={50} align="center" justify="center" horizontal flow={10}>
        <Text size="large" color={colors.grenade}>
          {request.organization.quorum}/{request.organization.number_of_admins}
        </Text>
        {arrowRight}
        <Text size="large" color={colors.ocean}>
          {request.quorum}/{request.organization.number_of_admins}
        </Text>
      </Box>
      {request.status !== "ABORTED" && request.status !== "APPROVED" ? (
        <RichModalFooter>
          <RequestActionButtons
            onSuccess={() => {
              refresh();
              close();
            }}
            entity={{ last_request: request }}
          />
        </RichModalFooter>
      ) : (
        <Box align="flex-end" height={35} pr={20}>
          <Status status={request.status} />
        </Box>
      )}
    </Box>
  );

  return <GrowingCard>{inner}</GrowingCard>;
}

export default connectData(OrganizationDetails, {
  RenderLoading: GrowingSpinner,
  queries: {
    request: RequestQuery,
  },
  propsToQueryParams: ({ match }) => ({
    requestID: match.params.id,
  }),
});
