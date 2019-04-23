// @flow

import React, { PureComponent } from "react";
import { translate } from "react-i18next";

import type { Translate } from "data/types";

import { InputText, Label } from "components/base/form";
import Box from "components/base/Box";
import Text from "components/base/Text";
import InfoBox from "components/base/InfoBox";
import type { UserCreationStepProps } from "../types";

type Props = UserCreationStepProps & {
  t: Translate,
};

class UserCreationInfo extends PureComponent<Props> {
  handleChangeUsername = (username: string) => {
    const { updatePayload } = this.props;
    updatePayload({ username });
  };

  handleChangeUserID = (userID: string) => {
    const { updatePayload } = this.props;
    updatePayload({ userID });
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
              maxLength={19}
              onlyAscii
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
export default translate()(UserCreationInfo);
