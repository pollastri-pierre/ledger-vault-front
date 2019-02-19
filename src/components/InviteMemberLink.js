// @flow

import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { FaPlus } from "react-icons/fa";

import Text from "components/base/Text";
import Box from "components/base/Box";
import colors from "shared/colors";

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;

  color: ${colors.ocean};

  &:hover {
    color: ${colors.mediumGrey};
  }
`;

export default ({
  onClick,
  member
}: {
  onClick: () => void,
  member: string
}) => (
  <Container>
    <Box horizontal flow={7} p={20} onClick={onClick} align="center">
      <FaPlus />
      <Text>
        <Trans
          i18nKey="inviteMember:inviteLink"
          values={{
            memberRole: member
          }}
        />
      </Text>
    </Box>
  </Container>
);
