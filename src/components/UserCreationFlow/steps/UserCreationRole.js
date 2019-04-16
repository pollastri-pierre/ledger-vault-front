// @flow

import React from "react";
import styled from "styled-components";
import ButtonBase from "@material-ui/core/ButtonBase";
import { Trans } from "react-i18next";

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
      <Label>
        <Trans i18nKey="inviteUser:steps.role.label" />
      </Label>
      <Box pt={80} horizontal align="center" justify="center" flow={20}>
        <Choice
          data-test="new_admin"
          isActive={role === "ADMIN"}
          onClick={() => updatePayload({ role: "ADMIN" })}
        >
          <Box flow={10}>
            <Text bold i18nKey="inviteUser:steps.role.admin.title" />
            <Text
              small
              color={colors.mediumGrey}
              i18nKey="inviteUser:steps.role.admin.desc"
            />
          </Box>
        </Choice>
        <Choice
          isActive={role === "OPERATOR"}
          data-test="new_operator"
          onClick={() => updatePayload({ role: "OPERATOR" })}
        >
          <Box flow={10}>
            <Text bold i18nKey="inviteUser:steps.role.operator.title" />
            <Text
              small
              color={colors.mediumGrey}
              i18nKey="inviteUser:steps.role.operator.desc"
            />
          </Box>
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
    padding: 20px;
    padding-top: 30px;
    border-radius: 4px;
  }
`;
