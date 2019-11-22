// @flow
import React from "react";
import type { Group, Whitelist } from "data/types";
import Box from "components/base/Box";
import Text from "components/base/Text";
import colors from "shared/colors";
import { FaArrowRight } from "react-icons/fa";

const arrowRight = <FaArrowRight />;

type Props = {
  entity: Group | Whitelist,
};
const DiffName = ({ entity }: Props) => {
  if (!entity.last_request) return null;
  const editName =
    entity.last_request.edit_data && entity.last_request.edit_data.name;
  if (!editName) return null;

  if (editName === entity.name) return null;

  return (
    <Box flow={15}>
      <Text fontWeight="bold">Name</Text>
      <Box horizontal align="center" flow={10}>
        <Text color={colors.grenade}>{entity.name}</Text>
        {arrowRight}
        <Text color={colors.green}>{editName}</Text>
      </Box>
    </Box>
  );
};

export default DiffName;
