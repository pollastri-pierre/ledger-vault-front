// @flow
import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import Box from "components/base/Box";
import Disabled from "components/Disabled";
import { InputText, Label } from "components/base/form";
import type { Translate } from "data/types";
import type { GroupCreationStepProps } from "./types";

type Props = GroupCreationStepProps & {
  t: Translate,
};

class GroupCreationDescription extends PureComponent<Props> {
  handleChangeName = (description: string) => {
    const { updatePayload } = this.props;
    updatePayload({ description });
  };

  render() {
    const { payload, t, isEditMode } = this.props;
    return (
      <Disabled disabled={isEditMode}>
        <Box>
          <Label>{t("group:create.desc_placeholder")}</Label>
          <InputText
            value={payload.description}
            autoFocus
            disabled={isEditMode}
            onChange={this.handleChangeName}
            placeholder={t("group:create.desc_placeholder")}
          />
        </Box>
      </Disabled>
    );
  }
}

export default translate()(GroupCreationDescription);