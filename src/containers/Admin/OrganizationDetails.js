// @flow

import React from "react";
import invariant from "invariant";
import { MdEdit } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";

import colors from "shared/colors";
import OrganizationQuery from "api/queries/OrganizationQuery";
import RequestQuery from "api/queries/RequestQuery";
import connectData from "restlay/connectData";
import ModalLoading from "components/ModalLoading";
import { RichModalHeader } from "components/base/MultiStepsFlow";
import Box from "components/base/Box";
import Text from "components/base/Text";
import RequestActionButtons from "components/RequestActionButtons";
import type { Request } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";

const arrowRight = <FaArrowRight size={9} color={colors.ocean} />;

function OrganizationDetails({
  request,
  close,
  restlay,
}: {
  request: Request,
  restlay: RestlayEnvironment,
  close: () => void,
}) {
  invariant(request.organization, "No organization found!");
  return (
    <Box width={500}>
      <RichModalHeader title="Edit admin rules request" Icon={MdEdit} />
      <Box py={50} align="center" justify="center" horizontal flow={10}>
        <Text large color={colors.grenade}>
          {request.organization.quorum}/{request.organization.number_of_admins}
        </Text>
        {arrowRight}
        <Text large color={colors.ocean}>
          {request.quorum}/{request.organization.number_of_admins}
        </Text>
      </Box>
      <RequestActionButtons
        onSuccess={() => {
          restlay.fetchQuery(new OrganizationQuery());
          close();
        }}
        entity={{ last_request: request }}
      />
    </Box>
  );
}

const RenderLoading = () => <ModalLoading height={100} width={100} />;
export default connectData(OrganizationDetails, {
  RenderLoading,
  queries: {
    request: RequestQuery,
  },
  propsToQueryParams: ({ match }) => ({
    requestID: match.params.id,
  }),
});
