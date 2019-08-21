// @flow

import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";

import type { Translate } from "data/types";

import { InputText, Label } from "components/base/form";
import Box from "components/base/Box";
import Text from "components/base/Text";
import InfoBox from "components/base/InfoBox";
import type { UserCreationStepProps } from "../types";

type Props = UserCreationStepProps & {
  t: Translate,
};

export const isValidUserIDChar = (c: string) => {
  const charCode = c.charCodeAt(0);
  const isNumber = charCode >= 48 && charCode <= 57;
  const isUppercaseLetter = charCode >= 65 && charCode <= 90;
  return isNumber || isUppercaseLetter;
};

const userIDHints = [
  {
    key: "nbCharts",
    label: "Exactly 16 characters",
    check: v => v.length === 16,
  },
  {
    key: "alphanum",
    label: "Contains only numbers and uppercase letters",
    check: v => v.split("").every(isValidUserIDChar),
  },
];

class UserCreationInfo extends PureComponent<Props> {
  handleChangeUsername = (username: string) => {
    const { updatePayload } = this.props;
    updatePayload({ username });
  };

  handleChangeUserID = (userID: string) => {
    const { updatePayload } = this.props;
    updatePayload({
      userID: userID
        .toUpperCase()
        .split("")
        .filter(isValidUserIDChar)
        .join(""),
    });
  };

  render() {
    const { payload, t } = this.props;
    const { username, userID } = payload;

    return (
      <Box grow>
        <Box flow={15} grow>
          <Box>
            <Label>{t("inviteUser:form.labelUsername")}</Label>
            <InputText
              data-test="username"
              value={username}
              autoFocus
              onChange={this.handleChangeUsername}
              placeholder={t("inviteUser:form.placeholderUsername")}
              fullWidth
              maxLength={19}
              onlyAscii
            />
          </Box>
          <Box>
            <Label>{t("inviteUser:form.labelUserID")}</Label>
            <InputText
              data-test="userID"
              value={userID}
              onChange={this.handleChangeUserID}
              placeholder={t("inviteUser:form.placeholderUserID")}
              fullWidth
              maxLength={16}
              onlyAscii
              hints={userIDHints}
            />
          </Box>
        </Box>
        {payload.role === "ADMIN" && (
          <InfoBox type="warning" withIcon>
            <Text i18nKey="inviteUser:steps.infos.warningAddAdmin" />
          </InfoBox>
        )}
      </Box>
    );
  }
}
export default withTranslation()(UserCreationInfo);
