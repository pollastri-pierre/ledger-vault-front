// @flow
import React from "react";
import Text from "components/base/Text";
import Box from "components/base/Box";

import colors from "shared/colors";

type Props = {
  label: string,
  selected: boolean,
};
export default function LabelLink(props: Props) {
  const { selected, label } = props;
  return (
    <Box mb={15} pl={40}>
      <Text
        uppercase
        fontWeight="semiBold"
        size="small"
        color={selected ? colors.black : colors.steel}
      >
        {label}
      </Text>
    </Box>
  );
}
