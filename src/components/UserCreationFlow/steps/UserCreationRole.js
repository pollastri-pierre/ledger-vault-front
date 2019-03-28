// @flow

import React from "react";
import styled from "styled-components";
import ButtonBase from "@material-ui/core/ButtonBase";

import colors, { opacity } from "shared/colors";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { Label } from "components/base/form";
import type { UserCreationStepProps } from "../types";

export default (props: UserCreationStepProps) => {
  const { payload, updatePayload } = props;
  const { role } = payload;
  return (
    <Box>
      <Label>Choose a role for the new user</Label>
      <Box pt={40} horizontal align="center" justify="center" flow={30}>
        <Choice
          isActive={role === "ADMIN"}
          onClick={() => updatePayload({ role: "ADMIN" })}
        >
          <Text bold>Administrator</Text>
          <Text small color={colors.mediumGrey}>
            User will be able to create other users, groups, etc.
          </Text>
        </Choice>
        <Choice
          isActive={role === "OPERATOR"}
          onClick={() => updatePayload({ role: "OPERATOR" })}
        >
          <Text bold>Operator</Text>
          <Text small color={colors.mediumGrey}>
            User will be able to create and validate transactions.
          </Text>
        </Choice>
      </Box>
    </Box>
  );
};

const Choice = styled(({ isActive, ...p }) => <ButtonBase {...p} />)`
  && {
    display: block;
    background: ${p => (p.isActive ? opacity(colors.ocean, 0.05) : "white")};
    border: 2px solid ${p => (p.isActive ? opacity(colors.ocean, 0.4) : "#eee")};
    width: 200px;
    height: 200px;
  }
`;
