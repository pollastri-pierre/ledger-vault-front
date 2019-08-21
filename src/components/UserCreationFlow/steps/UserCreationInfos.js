// @flow

import React from "react";
import { withTranslation, useTranslation } from "react-i18next";

import type { Translate } from "data/types";

import { InputText, Label } from "components/base/form";
import Box from "components/base/Box";
import Text from "components/base/Text";
import InfoBox from "components/base/InfoBox";
import type { UserCreationStepProps } from "../types";

type Props = UserCreationStepProps & {
  t: Translate,
};

const isUserIDCharValid = (c: string) => {
  const charCode = c.charCodeAt(0);
  const isNumber = charCode >= 48 && charCode <= 57;
  const isUppercaseLetter = charCode >= 65 && charCode <= 90;
  return isNumber || isUppercaseLetter;
};

export const isUserIDValid = (v: string) =>
  !!v && v.length === 16 && v.split("").every(isUserIDCharValid);

const userIDHints = [
  {
    key: "nbCharts",
    label: "Exactly 16 characters",
    check: v => v.length === 16,
  },
  {
    key: "alphanum",
    label: "Contains only numbers and uppercase letters",
    check: v => v.split("").every(isUserIDCharValid),
  },
];

export const InputUserID = ({
  value,
  onChange,
  ...props
}: {
  value: string,
  onChange: string => void,
}) => {
  const { t } = useTranslation();
  const handleChange = (userID: string) =>
    onChange(
      userID
        .toUpperCase()
        .split("")
        .filter(isUserIDCharValid)
        .join(""),
    );
  return (
    <InputText
      data-test="userID"
      value={value}
      onChange={handleChange}
      placeholder={t("inviteUser:form.placeholderUserID")}
      maxLength={16}
      hints={userIDHints}
      {...props}
    />
  );
};

function UserCreationInfo(props: Props) {
  const { payload, updatePayload, t } = props;
  const { username, userID } = payload;

  const handleChangeUsername = (username: string) =>
    updatePayload({ username });
  const handleChangeUserID = (userID: string) => updatePayload({ userID });

  return (
    <Box grow>
      <Box flow={15} grow>
        <Box>
          <Label>{t("inviteUser:form.labelUsername")}</Label>
          <InputText
            data-test="username"
            value={username}
            autoFocus
            onChange={handleChangeUsername}
            placeholder={t("inviteUser:form.placeholderUsername")}
            fullWidth
            maxLength={19}
            onlyAscii
          />
        </Box>
        <Box>
          <Label>{t("inviteUser:form.labelUserID")}</Label>
          <InputUserID value={userID} onChange={handleChangeUserID} />
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

export default withTranslation()(UserCreationInfo);
