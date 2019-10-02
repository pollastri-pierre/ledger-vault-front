// @flow

import React from "react";
import styled from "styled-components";

import Box from "components/base/Box";
import Text from "components/base/Text";
import Check from "components/icons/Check";

import colors from "shared/colors";

type Props = {
  title: React$Node,
  desc?: React$Node,
};
export default function MultiStepsSuccess(props: Props) {
  const { title, desc } = props;
  return (
    <Box align="center" justify="center" flow={30} mt={30}>
      <SuccessIconWrapper>
        <Check color={colors.green} size={40} />
      </SuccessIconWrapper>
      <Box flow={10} align="center" data-test="success_msg" justify="center">
        <Text header bold>
          {title}
        </Text>
        {desc && (
          <Text large textAlign="center">
            {desc}
          </Text>
        )}
      </Box>
    </Box>
  );
}

const SuccessIconWrapper = styled(Box).attrs({
  borderRadius: "50%",
})`
  width: 100px;
  height: 100px;
  border: 2px solid ${colors.green};
  background-color: ${colors.gLive};
  justify-content: center;
  align-items: center;
`;
